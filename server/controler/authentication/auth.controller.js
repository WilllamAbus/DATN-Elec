const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../model/users.model");
const crypto = require("crypto");
const Role = require("../../model/role.model");
const jwtSecret = process.env.JWT_ACCESS_KEY;
const jwtRefreshSecret = process.env.JWT_REFRESH_KEY;
let refreshTokens = [];
const authController = {
  registerUser: async (req, res) => {
    try {
      // Tìm vai trò người dùng
      const userRole = await Role.findOne({ name: "user" });
      if (!userRole) {
        return res.status(500).json({ msg: "User role not found" });
      }

      const { email, password, name } = req.body;

      // Kiểm tra xem email đã tồn tại chưa
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(400).json({ msg: "Email đã tồn tại" });
      }

      const newUser = new User({
        email,
        name,
        password,
        roles: [userRole._id],
      });

      const user = await newUser.save();

      res.status(200).json({ msg: "Người dùng đã đăng ký thành công", user });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  },

  generateToken: (user) => {
    const payload = {
      id: user.id,
      name: user.name,
      roles: user.roles,
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: "30d" });
  },

  generateRefreshToken: (user) => {
    const payload = {
      id: user.id,
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
          .status(400)
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

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
      });

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
  getProfile: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Lỗi server khi lấy thông tin người dùng:", error);
      res.status(500).json({
        message: "Lỗi server khi lấy thông tin người dùng",
        error: error.message,
      });
    }
  },
  verifyEmail: async (req, res) => {},

  resendEmail: async (req, res) => {},

  forgotPassword: async (req, res) => {},

  resetPassword: async (req, res) => {},

  updatePassword: async (req, res) => {},

  deleteUser: async (req, res) => {},
};

module.exports = authController;
