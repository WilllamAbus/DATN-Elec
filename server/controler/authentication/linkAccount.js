const { linkAccountService } = require("../../services/linkAccountService");
const authController = require("./auth.controller");


const linkAccount = async (req, res) => {
  try {
    const { token: requestToken, email, password } = req.body; 

    if (!requestToken || !password) {
      return res.status(400).json({
        message: "Token và mật khẩu là bắt buộc.",
      });
    }

    const response = await linkAccountService(requestToken, email, password);  
    console.log(response);

    if (response.err === 1) {
      return res.status(400).json({ message: response.message });
    }

    const user = response.user;
    console.log(user);


    const token = authController.generateToken(user);  
    console.log(token);
    

    const { password: userPassword, ...others } = user._doc;
    return res.status(200).json({
      ...others,
      accessToken: token, 
      roles: user.roles,
      message: "Liên kết tài khoản thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi liên kết tài khoản:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi liên kết tài khoản.",
      error: error.message,
    });
  }
};

module.exports = { linkAccount };
