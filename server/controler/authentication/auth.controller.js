const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../model/users.model");
const {
  sendPasswordResetEmail,
  sendVerificationEmail,
} = require("../../services/email.service");
const crypto = require("crypto");
const Role = require("../../model/role.model");

const jwtSecret = process.env.JWT_ACCESS_KEY;
const jwtRefreshSecret = process.env.JWT_REFRESH_KEY;
let refreshTokens = [];
const authController = {
  registerUser: async (req, res) => {
    try {
      // Tìm vai trò người dùng
      const userRole = await Role.findOne({ name: "admin" });
      if (!userRole) {
        return res
          .status(500)
          .json({ msg: "Không tìm thấy vai trò người dùng" });
      }

      const { email, password, name } = req.body;

      // Kiểm tra xem email đã tồn tại chưa
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(200).json({ msg: "Email đã tồn tại" });
      }

      const newUser = new User({
        email,
        name,
        password,
        roles: [userRole._id],
      });

      const user = await newUser.save();
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      user.emailVerificationToken = hashedToken;
      user.emailVerificationExpires = Date.now() + 3600000; // 1 giờ
      await sendVerificationEmail(user.email, token);

      return res
        .status(200)
        .json({ msg: "Đăng ký thành công. Vui lòng kiểm tra Email" });

 
      // res.status(200).json({ msg: "Người dùng đã đăng ký thành công", user });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ msg: "Token is invalid or has expired" });
      }

      user.Verifiedemail = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.status(200).json({ msg: "Email verified successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  },

  //Xác minh lại Email
  resendEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Email không tồn tại" });
      }

      if (user.Verifiedemail) {
        return res.status(400).json({ msg: "Email đã được xác minh trước đó" });
      }

      const token = crypto.randomBytes(20).toString("hex");
      user.emailVerificationToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      user.emailVerificationExpires = Date.now() + 3600000;
      await user.save();

      await sendVerificationEmail(email, token);

      res.status(200).json({
        msg: "Mã xác minh đã được gửi lại. Vui lòng kiểm tra email của bạn.",
      });
    } catch (err) {
      res.status(500).json({ msg: "Lỗi server", error: err.message });
    }
  },
  generateToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: "30d" });
  },

  generateRefreshToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    };
    return jwt.sign(payload, jwtRefreshSecret, { expiresIn: "30d" });
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(401)
          .json({ msg: "Thông tin đăng nhập không chính xác" });
      }

      const validPassword = await user.comparePassword(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res
          .status(401)
          .json({ msg: "Thông tin đăng nhập không chính xác" });
      }

      const token = authController.generateToken(user);

      const refreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(refreshToken);

      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   path: "/",
      //   sameSite: "strict",
      // });

      const { password, ...others } = user._doc;
      return res.status(200).json({ ...others, accessToken: token });
    } catch (err) {
      return res.status(500).json({ msg: "Server error", error: err.message });
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Bạn chưa đăng nhập" });
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ msg: "Token này không phải của bạn" });
    }

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    try {
      const userPayload = jwt.verify(refreshToken, jwtRefreshSecret);

      const newAccessToken = authController.generateToken(userPayload);
      const newRefreshToken = authController.generateRefreshToken(userPayload);
      refreshTokens.push(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
      });

      return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      return res
        .status(403)
        .json({ msg: "Refresh token không hợp lệ", error: err.message });
    }
  },
  logout: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    return res.status(200).json({ msg: "Đăng xuất thành công" });
  },

  list: async (req, res) => {
    try {
      const arayUser = await User.find();
      res.status(200).json({ data: arayUser });
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({ message: "Server errors" });
      }
    }
  },

  hardDelete: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      res.status(200).json({ message: "Người dùng đã được xóa thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  updateProfile: async (req, res) => {
    const { name, birthday, gender, phone, address } = req.body;
    const userId = req.user.id;

    console.log("ID từ token:", userId);

    console.log("Dữ liệu gửi lên:", req.body);

    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (birthday) user.birthday = birthday;
      if (gender) user.gender = gender;
      if (phone) user.phone = phone;
      if (address) user.address = address;

      const updatedUser = await user.save();

      // Gửi phản hồi thành công
      return res.status(200).json({ msg: "Cập Nhật Thành Công" });
    } catch (error) {
      console.error("Server error updating user profile:", error);
      return res.status(500).json({
        msg: "Server error updating user profile",
        error: error.message,
      });
    }
  },
  // getProfile: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     if (!userId) {
  //       return res.status(400).json({ message: "User ID is not defined" });
  //     }
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: "Không tìm thấy người dùng" });
  //     }
  //     res.status(200).json(user);
  //   } catch (error) {
  //     console.error("Lỗi server khi lấy thông tin người dùng:", error);
  //     res.status(500).json({
  //       message: "Lỗi server khi lấy thông tin người dùng",
  //       error: error.message,
  //     });
  //   }
  // },
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID is not defined" });
      }

      const user = await User.findById(userId).populate("roles");

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      const roleNames = user.roles.map((role) => role.name);

      res.status(200).json({
        ...user.toObject(),
        roles: roleNames,
      });
    } catch (error) {
      console.error("Lỗi server khi lấy thông tin người dùng:", error);
      res.status(500).json({
        message: "Lỗi server khi lấy thông tin người dùng",
        error: error.message,
      });
    }
  },
  resendEmail: async (req, res) => {},

  forgotPassword: async (req, res) => {},

  resetPassword: async (req, res) => {},

  updatePassword: async (req, res) => {},

  deleteUser: async (req, res) => {},
};

module.exports = authController;
