"use strict";
const modelSupplier = require("../../model/suppliers.model");
const admin = require("firebase-admin");
const serviceAccount = require("../../config/serviceAccount.json");
const multer = require("multer");
const Role = require("../../model/role.model");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

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

const supplierController = {
  listSuppliers: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;  // Sử dụng hệ thập phân, mặc định là 1 nếu không có giá trị
      const limit = parseInt(req.query.limit, 5) || 5; // Sử dụng hệ thập phân, mặc định là 10 nếu không có giá trị

      const count = await modelSupplier.countDocuments({
        status: { $ne: "disable" },
      });
      const totalPages = Math.ceil(count / limit);
      const suppliers = await modelSupplier.find({
        status: { $ne: "disable" },
      })
        .skip((page - 1) * limit)
        .limit(limit);
      res.status(200).json({
        success: true,
        msg: "Lấy danh sách nhà cung cấp thành công",
        data: suppliers,
        totalPages: totalPages,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
      res.status(500).json({
        success: false,
        msg: "Lỗi khi lấy danh sách nhà cung cấp",
        error: error.message,
      });
    }
  },

  addSupplier: async (req, res) => {
    try {
      const adminRole = await Role.findOne({ name: "admin" });

      if (!adminRole) {
        return res
          .status(500)
          .json({ message: "Không tìm thấy vai trò quản trị viên" });
      }

      const isAdmin = req.user.roles.some(
        (role) => role._id.toString() === adminRole._id.toString()
      );

      if (!isAdmin) {
        return res
          .status(401)
          .json({ message: "Bạn không có quyền thêm mới nhà cung cấp" });
      }

      let { name, address, phone, description } = req.body;
      const image = req.file;
      console.log(image);

      if (!name || !address || !phone || !description) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ thông tin nhà cung cấp" });
      }

      const existingSupplier = await modelSupplier.findOne({ name: name });
      if (existingSupplier) {
        return res.status(400).json({ message: "Tên nhà cung cấp đã tồn tại, vui lòng chọn tên khác" });
      }

      let imageURL;
      if (image) {
        if (!Buffer.isBuffer(image.buffer)) {
          return res
            .status(400)
            .json({ message: "Dữ liệu hình ảnh không hợp lệ" });
        }

        try {
          const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
          const file = bucket.file(`suppliers/${filename}`);

          await file.save(image.buffer, {
            metadata: { contentType: image.mimetype },
          });

          await file.makePublic();
          imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
            }/o/${encodeURIComponent(file.name)}?alt=media`;
        } catch (err) {
          console.error("Lỗi khi tải lên Firebase Storage:", err);
          return res
            .status(500)
            .json({
              message: "Không thể tải lên hình ảnh",
              error: err.message,
            });
        }
      }

      const data = { name, address, phone, description, image: imageURL };
      const savedSupplier = await modelSupplier.create(data);
      res
        .status(201)
        .json({ message: "Nhà cung cấp được tạo thành công", savedSupplier });
    } catch (error) {
      console.error("Lỗi khi thêm nhà cung cấp:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  },
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const supplier = await modelSupplier.findById(id);

      if (!supplier) {
        return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
      }

      res.status(200).json(supplier);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID nhà cung cấp từ params
      const { name, description, address, phone } = req.body; // Lấy thông tin cần cập nhật từ body
      const image = req.file ? req.file : undefined;

      // Kiểm tra đầu vào
      if (!name || !description || !address || !phone) {
        return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
      }

      // Kiểm tra xem tên nhà cung cấp có trùng không (ngoại trừ nhà cung cấp hiện tại)
      const existingSupplier = await modelSupplier.findOne({
        name: name.trim(),
        _id: { $ne: id }, // Loại trừ nhà cung cấp đang được cập nhật
      });

      if (existingSupplier) {
        return res
          .status(400)
          .json({ message: "Tên nhà cung cấp đã tồn tại, vui lòng chọn tên khác" });
      }

      let imageURL;

      // Nếu có hình ảnh, tải lên và lấy URL
      if (image) {
        if (!Buffer.isBuffer(image.buffer)) {
          return res
            .status(400)
            .json({ message: "Dữ liệu hình ảnh không hợp lệ" });
        }
        const filename = `${uuidv4()}-${Date.now()}-${image.originalname}`;
        const file = bucket.file(`suppliers/${filename}`);
        const fileStream = file.createWriteStream({
          metadata: {
            contentType: image.mimetype,
          },
        });

        fileStream.on("error", (err) => {
          console.error("Lỗi khi tải lên Firebase Storage:", err);
          return res
            .status(500)
            .json({ message: "Không thể tải lên hình ảnh" });
        });

        fileStream.on("finish", async () => {
          try {
            await file.makePublic();
            imageURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name
              }/o/${encodeURIComponent(file.name)}?alt=media`;
            await updateSupplierInDB(); // Cập nhật cơ sở dữ liệu sau khi có URL
          } catch (err) {
            console.error("Lỗi khi lấy URL của hình ảnh:", err);
            return res
              .status(500)
              .json({ message: "Không thể lấy URL của hình ảnh" });
          }
        });

        fileStream.end(image.buffer);
      } else {
        await updateSupplierInDB(); // Cập nhật cơ sở dữ liệu nếu không có hình ảnh mới
      }

      async function updateSupplierInDB() {
        const updatedData = { name, address, phone, description };
        if (imageURL) {
          updatedData.image = imageURL; // Cập nhật URL hình ảnh nếu có
        }

        const updatedSuppliers = await modelSupplier.findByIdAndUpdate(
          id,
          updatedData,
          { new: true } // Trả về dữ liệu sau khi cập nhật
        );

        if (!updatedSuppliers) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy nhà cung cấp" });
        }

        return res.status(200).json({
          message: "Nhà cung cấp được cập nhật thành công",
          updatedSuppliers,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà cung cấp:", error);
      return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  },

  hardDelete: async (req, res) => {
    const { id } = req.params;
    try {
      const adminRole = await Role.findOne({ name: "admin" });

      if (!adminRole) {
        return res
          .status(500)
          .json({ message: "Không tìm thấy vai trò quản trị viên" });
      }

      const isAdmin = req.user.roles.some(
        (role) => role._id.toString() === adminRole._id.toString()
      );

      if (!isAdmin) {
        return res
          .status(403)
          .json({
            message:
              "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa nhà cung cấp",
          });
      }

      const hardDeletedSupplier = await modelSupplier.findByIdAndDelete(id);
      if (!hardDeletedSupplier) {
        return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
      }
      res.status(200).json({ message: "Nhà cung cấp đã được xóa thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  softDelete: async (req, res) => {
    try {
      const adminRole = await Role.findOne({ name: "admin" });

      if (!adminRole) {
        return res
          .status(500)
          .json({ message: "Không tìm thấy vai trò quản trị viên" });
      }

      const isAdmin = req.user.roles.some(
        (role) => role._id.toString() === adminRole._id.toString()
      );

      if (!isAdmin) {
        return res
          .status(403)
          .json({
            message:
              "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa nhà cung cấp",
          });
      }

      const id = req.params.id;
      // Cập nhật trạng thái của danh mục thành "Đã xóa"
      const softDeletedSupplier = await modelSupplier.findByIdAndUpdate(
        id,
        { status: "disable" },
        { new: true }
      );

      if (!softDeletedSupplier) {
        return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
      }

      // Trả về phản hồi thành công
      res
        .status(200)
        .json({ message: "Đã xóa thành công", data: softDeletedSupplier });
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi server
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  restore: async (req, res) => {
    try {
      const adminRole = await Role.findOne({ name: "admin" });

      if (!adminRole) {
        return res
          .status(500)
          .json({ message: "Không tìm thấy vai trò quản trị viên" });
      }

      const isAdmin = req.user.roles.some(
        (role) => role._id.toString() === adminRole._id.toString()
      );

      if (!isAdmin) {
        return res
          .status(403)
          .json({
            message:
              "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể khôi phục nhà cung cấp",
          });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu id nhà cung cấp" });
      }

      // Cập nhật trạng thái của sản phẩm thành 'active'
      const restoreSupplier = await modelSupplier.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
      );

      if (!restoreSupplier) {
        return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
      }

      // Trả về phản hồi thành công
      res
        .status(200)
        .json({
          message: "Nhà cung cấp đã được khôi phục thành công",
          data: restoreSupplier,
        });
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi server
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  deletedList: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;  // Sử dụng hệ thập phân, mặc định là 1 nếu không có giá trị
      const limit = parseInt(req.query.limit, 5) || 5; // Sử dụng hệ thập phân, mặc định là 10 nếu không có giá trị

      const count = await modelSupplier.countDocuments({
        status: { $ne: "disable" },
      });
      const totalPages = Math.ceil(count / limit);

      const deleteListSupplier =
        (await modelSupplier.find({ status: "disable" })
          .skip((page - 1) * limit)
          .limit(limit)) || [];

      res.status(200).json({
        success: true,
        msg: "Lấy danh sách nhà cung cấp thành công",
        data: deleteListSupplier,
        totalPages: totalPages,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  search: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;  // Default to page 1 if not provided
      const limit = parseInt(req.query.limit, 10) || 10;  // Default to 10 results per page if not provided
      const keyword = req.query.keyword;  // Use keyword from query parameters

      // Validate page and limit
      if (isNaN(page) || page <= 0) {
        return res.status(400).json({
          message: "Số trang không hợp lệ",
        });
      }

      if (isNaN(limit) || limit <= 0 || limit > 100) {  // Limit to a max of 100
        return res.status(400).json({
          message: "Giới hạn số lượng kết quả trên mỗi trang không hợp lệ",
        });
      }

      if (!keyword || keyword.trim() === "") {
        return res.status(400).json({
          message: "Từ khóa tìm kiếm không hợp lệ",
        });
      }

      // Search for suppliers using keyword (case-insensitive) and active status
      const searchQuery = {
        name: { $regex: keyword, $options: "i" }, // Case-insensitive search
        status: "active",
      };

      // Get the total count for pagination purposes
      const totalResults = await modelSupplier.countDocuments(searchQuery);

      // If no results, return a suitable message
      if (totalResults === 0) {
        return res.status(200).json({
          message: "Không tìm thấy kết quả nào",
          data: [],
          totalResults: 0,
        });
      }

      // Execute the search query with pagination
      const result = await modelSupplier
        .find(searchQuery)
        .skip((page - 1) * limit)
        .limit(limit);

      // Return the search results with pagination info
      res.status(200).json({
        message: "Tìm kiếm thành công",
        data: result,
        currentPage: page,
        totalResults,
        totalPages: Math.ceil(totalResults / limit),
      });
    } catch (error) {
      console.error("Lỗi trong quá trình tìm kiếm:", error);
      res.status(500).json({
        message: "Lỗi máy chủ",
        error: error.message,
      });
    }
  },
  searchDelete: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;  // Default to page 1 if not provided
      const limit = parseInt(req.query.limit, 10) || 10;  // Default to 10 results per page if not provided
      const keyword = req.query.keyword;  // Use keyword from query parameters

      // Validate page and limit
      if (isNaN(page) || page <= 0) {
        return res.status(400).json({
          message: "Số trang không hợp lệ",
        });
      }

      if (isNaN(limit) || limit <= 0 || limit > 100) {  // Limit to a max of 100
        return res.status(400).json({
          message: "Giới hạn số lượng kết quả trên mỗi trang không hợp lệ",
        });
      }

      if (!keyword || keyword.trim() === "") {
        return res.status(400).json({
          message: "Từ khóa tìm kiếm không hợp lệ",
        });
      }

      // Search for suppliers using keyword (case-insensitive) and active status
      const searchQuery = {
        name: { $regex: keyword, $options: "i" }, // Case-insensitive search
        status: "disable",
      };

      // Get the total count for pagination purposes
      const totalResults = await modelSupplier.countDocuments(searchQuery);

      // If no results, return a suitable message
      if (totalResults === 0) {
        return res.status(200).json({
          message: "Không tìm thấy kết quả nào",
          data: [],
          totalResults: 0,
        });
      }

      // Execute the search query with pagination
      const result = await modelSupplier
        .find(searchQuery)
        .skip((page - 1) * limit)
        .limit(limit);

      // Return the search results with pagination info
      res.status(200).json({
        message: "Tìm kiếm thành công",
        data: result,
        currentPage: page,
        totalResults,
        totalPages: Math.ceil(totalResults / limit),
      });
    } catch (error) {
      console.error("Lỗi trong quá trình tìm kiếm:", error);
      res.status(500).json({
        message: "Lỗi máy chủ",
        error: error.message,
      });
    }
  },

};

supplierController.upload = upload.single("image");

module.exports = supplierController;
