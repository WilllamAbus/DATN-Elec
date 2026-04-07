const modelUser = require("../../model/users.model");
const modelRole = require("../../model/role.model");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const serviceAccount = require("../authentication/authFirebase.json");
const admin = require("firebase-admin");
const multer = require("multer");
const STORE_BUCKET = process.env.STORE_BUCKET;
const UserService = require("../../services/auth.service");
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

exports.add = async (req, res) => {
  const { email, password, name, avatar, roles } = req.body;

  try {
    let user = await modelUser.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new modelUser({
      email,
      password: passwordHash,
      name,
      avatar,
      roles: roles ? roles : "user",
      createdAt: new Date(),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.list = async (req, res) => {
//   try {
//     const arayUser = await modelUser.find({ status: { $ne: "disable" } });
//     res.status(200).json({ data: arayUser });
//   } catch (error) {
//     res.status(500).json({ message: "Server errors" });
//   }
// };

// exports.list = async (req, res) => {
//   try {
//     const ListUser = await modelUser.find({ status: "active" });
//     res.status(200).json(ListUser);
//   } catch (error) {
//     res.status(500).json({ message: "Server errors" });
//   }
// };

exports.list = async (req, res) => {
  try {
    const listUsers = await modelUser
      .find({ status: "active" })
      .populate("roles");
    const userRole = listUsers.map((user) => {
      const roleNames = user.roles.map((role) => role.name);
      return {
        ...user.toObject(),
        roles: roleNames,
      };
    });
    res.status(200).json(userRole);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server errors" });
  }
};

exports.getUseLimit = async (req, res) => {
  const { page, search } = req.query;

  try {
    const response = await UserService.getUseLimitService(page, search);
    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || "Lỗi khi lấy đơn hàng",
        status: 400,
      });
    }

    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(
      response.response.total / (+process.env.LIMIT || 1)
    );

    return res.status(200).json({
      success: true,
      err: 0,
      msg: "OK",
      status: 200,
      data: response.response,
      pagination: {
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      err: -1,
      msg: "Lỗi: " + error.message,
      status: 500,
    });
  }
};
exports.getdisableLimit = async (req, res) => {
  const { page, search } = req.query;

  try {
    const response = await UserService.getdisableLimitService(page, search);
    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || "Lỗi khi lấy đơn hàng",
        status: 400,
      });
    }

    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(
      response.response.total / (+process.env.LIMIT || 1)
    );

    return res.status(200).json({
      success: true,
      err: 0,
      msg: "OK",
      status: 200,
      data: response.response,
      pagination: {
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      err: -1,
      msg: "Lỗi: " + error.message,
      status: 500,
    });
  }
};
// Xóa cứng danh mục
exports.hardDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await modelUser.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ message: "người dùng đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Xóa mềm danh mục
exports.softDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const now = new Date();
    const UserId = req.user.id;
    if (id === UserId) {
      return res.status(400).json({
        message: "Bạn không thể tự xóa tài khoản của chính mình.",
      });
    }

    const softDeleteUser = await modelUser.findByIdAndUpdate(
      id,
      {
        status: "disable",
        disabledAt: now,
      },
      { new: true, runValidators: true }
    );

    if (!softDeleteUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    console.log("Updated User:", softDeleteUser);

    res.status(200).json({
      message: "Người dùng đã được khóa thành công!",
      user: softDeleteUser,
    });
  } catch (error) {
    console.error("Error in softDelete:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.list = async (req, res) => {
  try {
    const listUsers = await modelUser
      .find({ status: "active" })
      .populate("roles");
    const userRole = listUsers.map((user) => {
      const roleNames = user.roles.map((role) => role.name);
      return {
        ...user.toObject(),
        roles: roleNames,
      };
    });
    res.status(200).json(userRole);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server errors" });
  }
};

exports.deletedList = async (req, res) => {
  try {
    const deleteListUser = await modelUser
      .find({ status: "disable" })
      .populate("roles");
    const userRole = deleteListUser.map((user) => {
      const roleNames = user.roles.map((role) => role.name);
      return {
        ...user.toObject(),
        roles: roleNames,
      };
    });
    res.status(200).json(userRole);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server errors" });
  }
};

// Khôi phục danh mục đã xóa mềm
exports.restore = async (req, res) => {
  try {
    const id = req.params.id;
    const restoredUser = await modelUser.findByIdAndUpdate(
      id,
      {
        status: "active",
        warning: 0,
        noteWarning: "",
      },
      { new: true }
    );
    if (!restoredUser) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }
    res.status(200).json({
      message: "Khôi phục tài khoản thành công!",
      user: restoredUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await modelUser.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// exports.update = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, address, phone, gender, birthday, roles } = req.body;
//     const avatar = req.file ? req.file : undefined;
//     let avatarURL;

//     if (avatar) {
//       const filename = `${uuidv4()}-${Date.now()}-${avatar.originalname}`;
//       const file = bucket.file(`avatars/${filename}`);
//       const fileStream = file.createWriteStream({
//         metadata: {
//           contentType: avatar.mimetype,
//         },
//       });

//       fileStream.on("finish", async () => {
//         try {
//           await file.makePublic();
//           const encodedFilename = encodeURIComponent(file.name);
//           avatarURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFilename}?alt=media`;

//           // Cập nhật thông tin người dùng kèm theo avatar
//           const updatedUser = await modelUser.findByIdAndUpdate(
//             id,
//             {
//               name,
//               address,
//               phone,
//               birthday,
//               gender,
//               avatar: avatarURL,
//               roles,
//             },
//             { new: true }
//           );

//           if (!updatedUser) {
//             return res
//               .status(404)
//               .json({ message: "Người dùng không tìm thấy" });
//           }

//           return res
//             .status(200)
//             .json({ message: "Cập Nhật Thành Công", user: updatedUser });
//         } catch (err) {
//           console.error("Lỗi khi lấy URL của hình ảnh:", err);
//           return res
//             .status(500)
//             .json({ message: "Không thể lấy URL của hình ảnh" });
//         }
//       });

//       fileStream.on("error", (err) => {
//         console.error("Lỗi khi tải lên hình ảnh:", err);
//         return res.status(500).json({ message: "Không thể tải lên hình ảnh" });
//       });

//       fileStream.end(avatar.buffer);
//     } else {
//       // Cập nhật thông tin người dùng mà không có avatar
//       const updatedUser = await modelUser.findByIdAndUpdate(
//         id,
//         { name, address, phone, gender, birthday, roles },
//         { new: true }
//       );

//       if (!updatedUser) {
//         return res.status(404).json({ message: "Người dùng không tìm thấy" });
//       }

//       return res
//         .status(200)
//         .json({ message: "Cập Nhật Thành Công", user: updatedUser });
//     }
//   } catch (error) {
//     console.error("Server error updating user profile:", error);
//     return res.status(500).json({
//       message: "Server error updating user profile",
//       error: error.message,
//     });
//   }
// };

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp mật khẩu mới" });
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedUser = await modelUser.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng không tìm thấy" });
    }

    return res.status(200).json({
      message: "Cập nhật mật khẩu thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Server error updating password:", error);
    return res.status(500).json({
      message: "Server error updating password",
      error: error.message,
    });
  }
};

//lay danh sách roles
exports.listRole = async (req, res) => {
  try {
    const roles = await modelRole.find();
    if (!roles || roles.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy role nào" });
    }
    res.status(200).json(roles); // Trả về danh sách role
  } catch (error) {
    console.error("Lỗi khi lấy danh sách role:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};
