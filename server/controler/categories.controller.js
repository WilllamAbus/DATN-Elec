"use strict";
//module
const {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
  softDeleteCategory,
  deletedList,
  restore,
  checkCategoryExists
} = require("../services/categories.service");

const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccount.json");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
// const { message } = require('./home');

dotenv.config();
const STORE_BUCKET = process.env.STORE_BUCKET;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: STORE_BUCKET, // Thay thế bằng URL bucket của bạn
});

const storage = admin.storage();
const bucket = storage.bucket();

const categoriesController = {
  checkCategory : async (req, res) => {
    try {
      const name = req.params.name;
      const exists = await checkCategoryExists(name);
      return res.status(200).json({ exists });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  uploadCategory: async (req, res) => {
    try {
      const { name, path } = req.body;

      const image = req.file;
      const pid = uuidv4();

      if (typeof name !== "string" || typeof path !== "string") {
        throw new Error("Invalid data types");
      }

      if (!req.file || typeof req.file.buffer !== "object") {
        throw new Error("Invalid image data");
      }
      // Upload file to Firebase Storage
      const filename = `${Date.now()}-${image.originalname}`;
      const file = bucket.file(`categories/${filename}`);
      const fileStream = file.createWriteStream({
        metadata: {
          contentType: image.mimetype,
        },
      });

      fileStream.on("error", (err) => {
        console.error("Error uploading to Firebase Storage:", err);
        res.status(500).json({ error: "Failed to upload image" });
      });

      fileStream.on("finish", async () => {
        await file.makePublic();
        const imgURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        const category = await createCategory({
          name, // Đ,ảm bảo rằng 'name' là một chuỗi
          pid, // Đảm bảo rằng 'pid' là một chuỗi
          path, // Đảm bảo rằng 'path' là một chuỗi
          imgURL,
        });

        res.status(200).json({ message: "Thêm vào thành công", category });
      });

      fileStream.end(image.buffer);
    } catch (error) {
      console.error("Error uploading category:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  getAllCategoriesController: async (req, res) => {
    try {
      const categories = await getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  getCategoryByIdController: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await getCategoryById(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  updateCategoryController: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, path } = req.body;
      const image = req.file;
      const pid = uuidv4();
      let imgURL;

      if (image) {
        const filename = `${Date.now()}-${image.originalname}`;
        const file = bucket.file(`categories/${filename}`);
        const fileStream = file.createWriteStream({
          metadata: {
            contentType: image.mimetype,
          },
        });

        fileStream.on("error", (err) => {
          console.error("Error uploading to Firebase Storage:", err);
          res.status(500).json({ error: "Failed to upload image" });
        });

        fileStream.on("finish", async () => {
          imgURL = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
          const updatedCategory = await updateCategory(id, {
            name,
            pid,
            path,
            imgURL,
          });
          res
            .status(200)
            .json({ message: "Cập nhật thành công", updatedCategory });
        });

        fileStream.end(image.buffer);
      } else {
        const updatedCategory = await updateCategory(id, { name, pid, path });
        res.status(200).json({ updatedCategory });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  deleteCategoryController: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await deleteCategory(id);

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  sofDelCate: async (req, res) => {
    try {
      const id = req.params.id;
      // Cập nhật trạng thái của danh mục thành "Đã xóa"
      const softDeletedCategory = await softDeleteCategory(id);

      if (!softDeletedCategory) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }

      // Trả về phản hồi thành công
      res
        .status(200)
        .json({ message: "Đã xóa thành công", softDel: softDeletedCategory });
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi server
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  deletedListCategory: async (req, res) => {
    try {
      const deleteListCategory = await deletedList();

      res.status(200).json({ data: deleteListCategory });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  restore: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu id sản phẩm" });
      }

      // Cập nhật trạng thái của sản phẩm thành 'active'
      const restoreProduct = await restore(id);

      if (!restoreProduct) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      // Trả về phản hồi thành công
      res
        .status(200)
        .json({
          message: "Sản phẩm đã được khôi phục thành công",
          data: restoreProduct,
        });
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi server
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = categoriesController;
