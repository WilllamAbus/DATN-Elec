const modelUser = require("../../model/users.model");
const modelRole = require("../../model/role.model");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const serviceAccount = require("../authentication/authFirebase.json");
const admin = require("firebase-admin");
const multer = require("multer");
const STORE_BUCKET = process.env.STORE_BUCKET;

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
  const { email, password, name, avatar, role } = req.body;

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
      role: role ? role : "user",
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

exports.list = async (req, res) => {
  try {
    const ListUser = await modelUser.find({ status: "active" });
    res.status(200).json(ListUser);
  } catch (error) {
    res.status(500).json({ message: "Server errors" });
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

    const softDeleteUser = await modelUser.findByIdAndUpdate(
      id,
      {
        status: "disable",
        disabledAt: now, // Lưu thời gian disable
      },
      { new: true, runValidators: true }
    );

    if (!softDeleteUser) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    console.log("Updated User:", softDeleteUser);

    res.status(200).json(softDeleteUser);
  } catch (error) {
    console.error("Error in softDelete:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy danh sách các tài khoản đã xóa mềm
exports.deletedList = async (req, res) => {
  try {
    const deleteListUser = await modelUser.find({ status: "disable" });
    res.status(200).json(deleteListUser);
  } catch (error) {
    res.status(500).json({ message: "Server errors" });
  }
};
// Khôi phục danh mục đã xóa mềm
exports.restore = async (req, res) => {
  try {
    const id = req.params.id;
    const restoredUser = await modelUser.findByIdAndUpdate(
      id,
      { status: "active" },
      { new: true }
    );
    if (!restoredUser) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    res.status(200).json(restoredUser);
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

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, address, phone, gender, birthday } = req.body;
    const avatar = req.file ? req.file : undefined;
    let avatarURL;
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

          const updatedUser = await modelUser.findByIdAndUpdate(
            id,
            { name, address, phone, birthday, gender, avatar: avatarURL },
            { new: true }
          );

          if (!updatedUser) {
            return res
              .status(404)
              .json({ message: "Người dùng không tìm thấy" });
          }

          return res
            .status(200)
            .json({ message: "Cập Nhật Thành Công", user: updatedUser });
        } catch (err) {
          console.error("Lỗi khi lấy URL của hình ảnh:", err);
          return res
            .status(500)
            .json({ message: "Không thể lấy URL của hình ảnh" });
        }
      });

      fileStream.end(avatar.buffer);
    } else {
      const updatedUser = await modelUser.findByIdAndUpdate(
        id,
        { name, address, phone, gender, birthday },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Người dùng không tìm thấy" });
      }
      return res
        .status(200)
        .json({ message: "Cập Nhật Thành Công", user: updatedUser });
    }
  } catch (error) {
    console.error("Server error updating user profile:", error);
    return res.status(500).json({
      message: "Server error updating user profile",
      error: error.message,
    });
  }
};

//lay danh sách roles
exports.listRole = async (req, res) => {
  try {
    const listRole = await modelRole.find({});
    res.status(200).json(listRole);
  } catch (error) {
    res.status(500).json({ message: "Server errors" });
  }
};
