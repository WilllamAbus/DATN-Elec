const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const serviceAccount = require("./authFirebase.json");
const User = require("../../model/users.model");
const authService = require("../../services/authGoogle.service");
const {
  sendPasswordResetEmail,
  sendVerificationEmail,
} = require("../../services/email.service");
const crypto = require("crypto");
const Role = require("../../model/role.model");
const multer = require("multer");

const jwtSecret = process.env.JWT_ACCESS_KEY;
const jwtRefreshSecret = process.env.JWT_REFRESH_KEY;
const admin = require("firebase-admin");
const STORE_BUCKET = process.env.STORE_BUCKET;
const axios = require("axios");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORE_BUCKET,
  });
}

const storage = admin.storage();
const bucket = storage.bucket();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });
let refreshTokens = [];
const authController = {
  // CheckEmailHunter: async (email) => {
  //   const apiKey = process.env.HUNTER_API_KEY;
  //   const apiUrl = process.env.HUNTER_API_URL;

  //   const url = `${apiUrl}?email=${email}&api_key=${apiKey}`;

  //   try {
  //     await axios.get(url);
  //     const data = response.data;
  //     if (
  //       data.data.result === "undeliverable" ||
  //       data.data.result === "risky"
  //     ) {
  //       return false;
  //     }
  //     return true;
  //   } catch (error) {
  //     console.error("Lỗi xác thực email với Hunter.io:", error);
  //     throw new Error("Không thể xác thực email");
  //   }
  // },
  CheckEmailHunter: async (email) => {
    const apiKey = process.env.HUNTER_API_KEY;
    const apiUrl = process.env.HUNTER_API_URL;

    const url = `${apiUrl}?email=${email}&api_key=${apiKey}`;

    try {
      const response = await axios.get(url);

      const data = response.data;

      if (
        data.data.status === "undeliverable" ||
        data.data.status === "risky"
      ) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Lỗi xác thực email với Hunter.io:", error);
      throw new Error("Không thể xác thực email");
    }
  },

  registerUser: async (req, res) => {
    try {
      const userRole = await Role.findOne({ name: "user" });
      if (!userRole) {
        return res
          .status(500)
          .json({ message: "Không tìm thấy vai trò người dùng" });
      }

      const { email, password, name } = req.body;
      const isEmailValid = await authController.CheckEmailHunter(email);
      if (!isEmailValid) {
        return res.status(400).json({ message: "Email không chính xác" });
      }
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(200).json({ message: "Email đã tồn tại" });
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

      await user.save();

      // Gửi email xác thực
      await sendVerificationEmail(user.email, token);
      console.log("Token:", hashedToken);
      console.log("Expires:", user.emailVerificationExpires);

      return res
        .status(200)
        .json({ message: "Đăng ký thành công. Vui lòng kiểm tra Email" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
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
        return res
          .status(400)
          .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Email đã được xác minh thành công" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  //Xác minh lại Email
  // resendEmail: async (req, res) => {
  //   try {
  //     const { email } = req.body;
  //     const user = await User.findOne({ email });

  //     if (!user) {
  //       return res.status(400).json({ message: "Email không tồn tại" });
  //     }

  //     if (user.VerifiedEmail) {
  //       return res
  //         .status(400)
  //         .json({ message: "Email đã được xác minh trước đó" });
  //     }

  //     const token = crypto.randomBytes(20).toString("hex");
  //     user.emailVerificationToken = crypto
  //       .createHash("sha256")
  //       .update(token)
  //       .digest("hex");
  //     user.emailVerificationExpires = Date.now() + 3600000;
  //     await user.save();

  //     await sendVerificationEmail(email, token);

  //     res.status(200).json({
  //       message:
  //         "Mã xác minh đã được gửi lại. Vui lòng kiểm tra email của bạn.",
  //     });
  //   } catch (err) {
  //     res.status(500).json({ message: "Lỗi server", error: err.message });
  //   }
  // },
  resendEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Email không tồn tại" });
      }

      if (user.VerifiedEmail) {
        return res
          .status(400)
          .json({ message: "Email đã được xác minh trước đó" });
      }

      const currentTime = Date.now();
      const lastVerificationTime = user.emailVerificationExpires || 0;

      // Nếu yêu cầu trước đó cách hiện tại chưa đủ 5 phút (300000 ms)
      if (currentTime - lastVerificationTime < 300000) {
        const remainingMinutes = Math.ceil(
          (300000 - (currentTime - lastVerificationTime)) / 60000
        );
        return res.status(400).json({
          message: `Vui lòng chờ thêm ${remainingMinutes} phút trước khi yêu cầu gửi lại mã xác minh.`,
        });
      }

      // Tạo mã xác minh mới
      const token = crypto.randomBytes(20).toString("hex");
      user.emailVerificationToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      user.emailVerificationExpires = Date.now() + 3600000; // Mã xác minh có hiệu lực trong 1 giờ

      await user.save();

      // Gửi email xác minh
      await sendVerificationEmail(email, token);

      res.status(200).json({
        message:
          "Mã xác minh đã được gửi lại. Vui lòng kiểm tra email của bạn.",
      });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  generateToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: "1d" });
  },

  generateRefreshToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    };
    console.log("Generating refresh token with payload:", payload);
    return jwt.sign(payload, jwtRefreshSecret, { expiresIn: "2d" });
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email }).populate(
        "roles"
      );
      if (!user) {
        return res
          .status(401)
          .json({ message: "Thông tin đăng nhập không chính xác" });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res
          .status(401)
          .json({ message: "Thông tin đăng nhập không chính xác" });
      }

      if (!user.isEmailVerified) {
        return res.status(400).json({ message: "Email chưa được xác minh" });
      }

      if (user.status !== "active") {
        console.log("Tài khoản đã bị khóa");
        return res.status(400).json({ message: "Tài khoản đã bị khóa" });
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

      const { password, ...userData } = user._doc;

      // Gửi thông tin vai trò và token về client
      return res.status(200).json({
        ...userData,
        accessToken: token,
        refreshToken,
        roles: user.roles,
        redirectTo: user.roles.some((role) => role.name === "admin")
          ? "/admin"
          : "/profile",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },

  loginSuccess: async (req, res) => {
    const { id, tokenLogin } = req.body;

    try {
      if (!id || !tokenLogin) {
        return res
          .status(400)
          .json({ err: 1, message: "Thiếu thông tin đầu vào" });
      }

      let response = await authService.loginSuccessService(id, tokenLogin);

      if (response.err === 1) {
        console.log(
          "Người dùng không tìm thấy hoặc token không hợp lệ:",
          id,
          tokenLogin
        );
        return res
          .status(401)
          .json({ message: "Thông tin đăng nhập không chính xác" });
      }

      const user = response.user;

      if (!user.isEmailVerified) {
        return res.status(400).json({ message: "Email chưa được xác minh" });
      }

      if (user.status !== "active") {
        console.log("Tài khoản đã bị khóa");
        return res.status(400).json({ message: "Tài khoản đã bị khóa" });
      }

      const token = authController.generateToken(user);
      const refreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
      });

      const { password, ...others } = user._doc;

      return res
        .status(200)
        .json({ ...others, accessToken: token, roles: user.roles });
    } catch (error) {
      console.error("Lỗi trong loginSuccess controller:", error);
      return res.status(500).json({
        err: -1,
        message: "Xử lý đăng nhập thất bại: " + error.message,
      });
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json("Bạn chưa được xác thực");
    }

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Token không hợp lệ");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json("Token không hợp lệ");
      }

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      const newAccessToken = authController.generateToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);

      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },

  logout: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    return res.status(200).json({ message: "Đăng xuất thành công" });
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
    try {
      const id = req.user.id;
      const { name, phone, gender, birthday } = req.body;
      const avatar = req.file ? req.file : undefined;
      let avatarURL;

      const currentUser = await User.findById(id);

      if (!currentUser) {
        return res.status(404).json({ message: "Người dùng không tìm thấy" });
      }

      if (avatar) {
        const filename = `${uuidv4()}-${Date.now()}-${avatar.originalname}`;
        const file = bucket.file(`avatars/${filename}`);
        const fileStream = file.createWriteStream({
          metadata: {
            contentType: avatar.mimetype,
          },
        });

        fileStream.on("finish", async () => {
          try {
            await file.makePublic();
            const encodedFilename = encodeURIComponent(file.name);
            avatarURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFilename}?alt=media`;

            const updatedUser = await User.findByIdAndUpdate(
              id,
              {
                name: name || currentUser.name,
                phone: phone || currentUser.phone,
                birthday: birthday || currentUser.birthday,
                gender: gender || currentUser.gender,
                avatar: avatarURL,
              },
              { new: true }
            );

            return res
              .status(200)
              .json({ message: "Cập Nhật Thành Công", user: updatedUser });
          } catch (err) {
            return res
              .status(500)
              .json({ message: "Không thể lấy URL của hình ảnh" });
          }
        });

        fileStream.end(avatar.buffer);
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          {
            name: name || currentUser.name,
            phone: phone || currentUser.phone,
            birthday: birthday || currentUser.birthday,
            gender: gender || currentUser.gender,
          },
          { new: true }
        );

        return res
          .status(200)
          .json({ message: "Cập Nhật Thành Công", user: updatedUser });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Server error updating user profile",
        error: error.message,
      });
    }
  },

  addAddress: async (req, res) => {
    try {
      const id = req.user.id;
      const { fullName, address, addressID, phone } = req.body;

      const currentUser = await User.findById(id);

      if (!currentUser) {
        return res.status(404).json({ message: "Người dùng không tìm thấy" });
      }

      let updatedAddresses = currentUser.addresses || [];

      // Kiểm tra nếu người dùng đã có 10 địa chỉ
      if (updatedAddresses.length >= 10) {
        return res.status(400).json({
          message: "Bạn chỉ có thể thêm tối đa 10 địa chỉ",
        });
      }

      updatedAddresses.push({
        fullName,
        address,
        addressID,
        phone,
        isDefault: updatedAddresses.length === 0, // Đặt làm mặc định nếu là địa chỉ đầu tiên
      });

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { addresses: updatedAddresses },
        { new: true }
      );

      return res.status(200).json({
        message: "Địa chỉ đã được thêm thành công",
        addresses: updatedUser.addresses,
      });
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      return res.status(500).json({
        message: "Lỗi khi thêm địa chỉ",
        error: error.message,
      });
    }
  },

  setDefaultAddress: async (req, res) => {
    try {
      const userId = req.user.id;
      const { addressId } = req.body; // `addressId` là `_id` của địa chỉ

      const currentUser = await User.findById(userId);

      if (!currentUser) {
        return res.status(404).json({ message: "Người dùng không tìm thấy" });
      }

      // Kiểm tra nếu địa chỉ được yêu cầu đã là địa chỉ mặc định
      const currentDefaultAddress = currentUser.addresses.find(
        (addr) => addr.isDefault
      );

      if (
        currentDefaultAddress &&
        currentDefaultAddress._id.toString() === addressId
      ) {
        return res.status(400).json({
          message: "Địa chỉ này đã là địa chỉ mặc định.",
        });
      }

      // Cập nhật tất cả các địa chỉ về isDefault: false, sau đó đặt địa chỉ có _id tương ứng là isDefault: true
      const updatedAddresses = currentUser.addresses.map((addr) => ({
        ...addr.toObject(),
        isDefault: addr._id.toString() === addressId, // So sánh `_id` với `addressId` từ request
      }));

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { addresses: updatedAddresses },
        { new: true }
      );

      return res.status(200).json({
        message: "Địa chỉ mặc định đã được cập nhật thành công",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Lỗi khi đặt địa chỉ mặc định:", error);
      return res.status(500).json({
        message: "Lỗi khi đặt địa chỉ mặc định",
        error: error.message,
      });
    }
  },
  updateAddress: async (req, res) => {
    try {
      const id = req.user.id; // Lấy ID người dùng từ xác thực
      const { addressId, fullName, address, addressID, phone, isDefault } =
        req.body;

      // Tìm người dùng
      const currentUser = await User.findById(id);

      if (!currentUser) {
        return res.status(404).json({ message: "Người dùng không tìm thấy" });
      }

      let updatedAddresses = currentUser.addresses || [];

      // Tìm địa chỉ cần chỉnh sửa
      const addressIndex = updatedAddresses.findIndex(
        (addr) => addr._id.toString() === addressId
      );

      if (addressIndex === -1) {
        return res.status(404).json({ message: "Địa chỉ không tồn tại" });
      }

      // Cập nhật thông tin địa chỉ
      updatedAddresses[addressIndex] = {
        ...updatedAddresses[addressIndex],
        fullName: fullName || updatedAddresses[addressIndex].fullName,
        address: address || updatedAddresses[addressIndex].address,
        addressID: addressID || updatedAddresses[addressIndex].addressID,
        phone: phone || updatedAddresses[addressIndex].phone,
        isDefault:
          isDefault !== undefined
            ? isDefault
            : updatedAddresses[addressIndex].isDefault,
      };

      // Nếu đặt địa chỉ là mặc định, cập nhật các địa chỉ khác
      if (isDefault) {
        updatedAddresses = updatedAddresses.map((addr, idx) => ({
          ...addr,
          isDefault: idx === addressIndex,
        }));
      }

      // Cập nhật danh sách địa chỉ cho người dùng
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { addresses: updatedAddresses },
        { new: true }
      );

      return res.status(200).json({
        message: "Địa chỉ đã được chỉnh sửa thành công",
        addresses: updatedUser.addresses,
      });
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa địa chỉ:", error);
      return res.status(500).json({
        message: "Lỗi khi chỉnh sửa địa chỉ",
        error: error.message,
      });
    }
  },

  // updateAddress: async (req, res) => {
  //   try {
  //     const userId = req.user.id; // Lấy ID của người dùng từ token
  //     const addressId = req.params.id; // Lấy ID địa chỉ từ URL
  //     const { fullName, address, addressID, phone, isDefault } = req.body;

  //     // Tìm người dùng trong cơ sở dữ liệu
  //     const currentUser = await User.findById(userId);
  //     if (!currentUser) {
  //       return res.status(404).json({ message: "Người dùng không tìm thấy" });
  //     }

  //     // Tìm địa chỉ cần chỉnh sửa
  //     const addressIndex = currentUser.addresses.findIndex(
  //       (addr) => addr._id.toString() === addressId
  //     );
  //     if (addressIndex === -1) {
  //       return res.status(404).json({ message: "Địa chỉ không tìm thấy" });
  //     }

  //     // Cập nhật thông tin địa chỉ
  //     currentUser.addresses[addressIndex] = {
  //       ...currentUser.addresses[addressIndex], // Giữ lại các thông tin cũ
  //       fullName,
  //       address,
  //       addressID,
  //       phone,
  //       isDefault:
  //         isDefault !== undefined
  //           ? isDefault
  //           : currentUser.addresses[addressIndex].isDefault, // Giữ nguyên trạng thái mặc định nếu không được cập nhật
  //     };

  //     // Lưu người dùng với địa chỉ đã cập nhật
  //     const updatedUser = await currentUser.save();

  //     return res.status(200).json({
  //       message: "Địa chỉ đã được cập nhật thành công",
  //       addresses: updatedUser.addresses,
  //     });
  //   } catch (error) {
  //     console.error("Lỗi khi chỉnh sửa địa chỉ:", error);
  //     return res.status(500).json({
  //       message: "Lỗi khi chỉnh sửa địa chỉ",
  //       error: error.message,
  //     });
  //   }
  // },
  fetchAddressById: async (req, res) => {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;

      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "Người dùng không tìm thấy" });
      }

      const address = currentUser.addresses.find(
        (addr) => addr._id.toString() === addressId
      );

      if (!address) {
        return res.status(404).json({ message: "Địa chỉ không tìm thấy" });
      }

      return res.status(200).json({
        message: "Lấy thông tin địa chỉ thành công",
        address,
      });
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
      return res.status(500).json({
        message: "Lỗi khi lấy thông tin địa chỉ",
        error: error.message,
      });
    }
  },

  removeAddress: async (req, res) => {
    try {
      const userId = req.user.id;
      const { addressId } = req.body; // Lấy addressId từ body request

      const currentUser = await User.findById(userId);

      if (!currentUser) {
        return res.status(404).json({ message: "Người dùng không tìm thấy" });
      }

      // Tìm địa chỉ để kiểm tra xem có tồn tại không
      const addressToRemove = currentUser.addresses.find(
        (address) => address._id.toString() === addressId
      );

      if (!addressToRemove) {
        return res.status(404).json({ message: "Địa chỉ không tìm thấy" });
      }

      // Kiểm tra xem địa chỉ muốn xóa có phải là địa chỉ mặc định không
      if (addressToRemove.isDefault) {
        return res
          .status(400)
          .json({ message: "Không thể xóa địa chỉ mặc định" });
      }

      // Xóa địa chỉ
      const updatedAddresses = currentUser.addresses.filter(
        (address) => address._id.toString() !== addressId
      );

      // Cập nhật lại danh sách địa chỉ của người dùng
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { addresses: updatedAddresses },
        { new: true }
      );

      return res.status(200).json({
        message: "Địa chỉ đã được xóa thành công",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      return res.status(500).json({
        message: "Lỗi khi xóa địa chỉ",
        error: error.message,
      });
    }
  },

  getAddressList: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Không được phép" });
      }

      const id = req.user.id;

      const currentUser = await User.findById(id).catch((error) => {
        throw new Error("Lỗi tìm người dùng: " + error.message);
      });

      if (!currentUser) {
        return res.status(404).json({ message: "Người dùng không tìm thấy" });
      }

      const sortedAddresses = currentUser.addresses.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return 0;
      });

      return res.status(200).json({
        message: "Danh sách địa chỉ",
        addresses: sortedAddresses,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      return res.status(500).json({
        message: "Lỗi khi lấy danh sách địa chỉ",
        error: error.message,
      });
    }
  },

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

  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu hiện tại và mật khẩu mới là bắt buộc" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Mật khẩu hiện tại không đúng" });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Cập nhật mật khẩu thành công" });
    } catch (error) {
      console.error("Lỗi server khi cập nhật mật khẩu:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      if (!email) {
        return res.status(400).json({ message: "Email là bắt buộc" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Email không tồn tại trên hệ thống" });
      }

      if (user.resetPasswordExpires && user.resetPasswordExpires > Date.now()) {
        return res.status(429).json({
          message: "Không được yêu cầu liên tục",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();

      await sendPasswordResetEmail(user.email, token);

      res.status(200).json({ message: "Đã gửi email đặt lại mật khẩu." });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { password, token } = req.body;
      if (!password || !token) {
        return res
          .status(400)
          .json({ message: "Password and token are required" });
      }

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: "Token đã hết hạn !!" });
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = authController;
