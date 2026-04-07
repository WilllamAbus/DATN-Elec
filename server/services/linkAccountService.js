const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/users.model");
const { v4: uuidv4 } = require("uuid");

const linkAccountService = async (requestToken, email, password) => { 
  try {
    let decoded;
    try {
      decoded = jwt.verify(requestToken, process.env.JWT_ACCESS_KEY);
    } catch (err) {
      return { err: 1, message: "Token không hợp lệ." };
    }

    const { googleId } = decoded;

    const user = await User.findOne({ email }).populate("roles");
    if (!user) {
      return { err: 1, message: "Người dùng không tồn tại." };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { err: 1, message: "Mật khẩu không đúng." };
    }

    if (!user.socialLogin || !user.socialLogin.googleId) {
      const tokenLogin = uuidv4();
      await User.updateOne(
        { email: user.email },
        {
          'socialLogin.googleId': googleId,
          tokenLogin,
          isEmailVerified: true,
        }
      );
      user.socialLogin = { googleId };
      user.tokenLogin = tokenLogin;
      user.isEmailVerified = true;
    }

    return { err: 0, message: "Liên kết tài khoản thành công.", user };
  } catch (error) {
    console.error("Lỗi trong linkAccount service:", error);
    throw new Error("Xử lý liên kết tài khoản thất bại: " + error.message);
  }
};

module.exports = { linkAccountService };
