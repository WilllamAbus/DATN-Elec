const commentService = require("../services/comment.service");
const modelProduct = require(`../model/product_v2/index`);
const modelRepComment = require("../model/repComment.model");
const modelUser = require("../model/users.model");
const modelComment = require("../model/comment.model");
const mongoose = require("mongoose");

const commentController = {
  userID: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await modelUser.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy user" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  comment: async (req, res) => {
    try {
      let { content, id_product, id_user, rating, createdAt } = req.body;

      if (!content || !id_product || !id_user || !rating) {
        return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
      }

      createdAt = createdAt ? new Date(createdAt) : new Date();
      let data = { content, id_product, id_user, rating, createdAt };

      // Save comment to database
      const savedComment = await commentService.createComment(data);
      res
        .status(201)
        .json({ message: "Bình luận được tạo thành công", savedComment });
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  },

  commentProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await commentService.findCommentsByProductId(id);
      if (comments.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
      }
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  getAllComments: async (req, res) => {
    try {
      const { page = 1, pageSize = 5 } = req.query;
      const result = await commentService.getAllComment(page, pageSize);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  },

  softDeleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await commentService.softDeleteComment(id);
      if (!result) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res
        .status(200)
        .json({ message: "Comment soft deleted successfully", result });
    } catch (error) {
      console.error("Error soft deleting comment:", error);
      res.status(500).json({ message: "Failed to soft delete comment" });
    }
  },

  getDeletedComments: async (req, res) => {
    try {
      const { page = 1, pageSize = 5 } = req.query;
      const result = await commentService.deletedListComment(page, pageSize);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching deleted comments:", error);
      res.status(500).json({ message: "Failed to fetch deleted comments" });
    }
  },

  restoreComment: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await commentService.restore(id);
      if (!result) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res
        .status(200)
        .json({ message: "Comment restored successfully", result });
    } catch (error) {
      console.error("Error restoring comment:", error);
      res.status(500).json({ message: "Failed to restore comment" });
    }
  },

  getSuggestions: async (req, res) => {
    try {
      const { query, limit = 5 } = req.query;
      const suggestions = await commentService.getSuggestions(query, limit);
      res.status(200).json(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  },

  searchCommentsAdmin: async (req, res) => {
    try {
      const { query, page = 1, pageSize = 10 } = req.query;
      const result = await commentService.searchCommentAdmin(
        query,
        page,
        pageSize
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error searching comments:", error);
      res.status(500).json({ message: "Failed to search comments" });
    }
  },
  getCommentProduct: async (req, res) => {
    try {
      const { id } = req.params;
      // Tìm sản phẩm theo id và populate các bình luận có status là 'active'
      const product = await modelProduct.findById(id).populate({
        path: "comments", // Đường dẫn tới mảng comments
        model: "Comment", // Model tương ứng
        match: { status: "active" }, // Điều kiện lọc chỉ lấy bình luận có trạng thái 'active'
        select: "content rating id_user id_product createdAt",
        options: { sort: { createdAt: -1 } }, // Sắp xếp từ mới nhất đến cũ nhất
      });

      // Kiểm tra xem sản phẩm có tồn tại và có bình luận hay không
      if (!product || product.comments.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
      }

      // Trả về các bình luận
      res.status(200).json(product.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  getCommentAdmin: async (req, res) => {
    try {

      const productsWithComments = await modelProduct
        .find({ "comments.0": { $exists: true } })
        .populate({
          path: "comments", // Đường dẫn tới mảng comments
          model: "Comment", // Model tương ứng
          match: { status: "active" }, // Điều kiện lọc chỉ lấy bình luận có trạng thái 'active'
          select: "content rating id_user id_product createdAt",
          options: { sort: { createdAt: -1 } }, // Sắp xếp từ mới nhất đến cũ nhất
        });

      if (!productsWithComments || productsWithComments.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm nào có bình luận" });
      }

      res.status(200).json(productsWithComments);
    } catch (error) {
      console.error("Error fetching products with comments:", error);
      res
        .status(500)
        .json({
          success: false,
          err: 3,
          msg: "Lỗi hệ thống",
          status: 500,
          error: error.message,
        });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const { idComment, idProduct } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(idComment) ||
        !mongoose.Types.ObjectId.isValid(idProduct)
      ) {
        return res.status(400).json({
          success: false,
          err: 1,
          msg: "Invalid comment or product ID",
          status: 400,
        });
      }

      const comment = await modelComment.Comment.findById(idComment);

      if (!comment) {
        return res.status(404).json({
          success: false,
          err: 1,
          msg: "Comment not found",
          status: 404,
        });
      }

      await modelComment.Comment.deleteOne({ _id: idComment });

      const updateResult = await modelProduct.updateOne(
        { _id: idProduct }, // Tìm sản phẩm theo idProduct
        { $pull: { comments: idComment } } // Xóa idComment khỏi mảng comments
      );

      // Kiểm tra nếu product không tồn tại hoặc không chứa comment
      if (updateResult.nModified === 0) {
        return res.status(404).json({
          success: false,
          err: 1,
          msg: "Product or comment reference not found in product",
          status: 404,
        });
      }

      // Xóa tất cả reply comment liên quan trong bảng modelRepComment
      const deleteResult = await modelRepComment.deleteMany({
        id_comment: idComment,
      });
      console.log("Deleted reply comments count:", deleteResult.deletedCount);

      return res.status(200).json({
        success: true,
        err: 0,
        msg: "Comment and related replies deleted successfully",
        status: 200,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        err: 1,
        msg: "System error",
        status: 500,
        error: error.message,
      });
    }
  },

  addCommentProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const commentData = req.body;
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      if (!commentData.id_user) {
        return res.status(400).json({ error: "User ID is required" });
      }

      commentData.id_product = productId;

      // Tạo comment mới
      const newComment = await modelComment.Comment.create(commentData);

      if (!newComment) {
        return res.status(404).json({ error: "Comment could not be added" });
      }

      // Cập nhật trường comments trong bảng product_v2
      const updatedProduct = await modelProduct.findByIdAndUpdate(
        productId,
        { $push: { comments: newComment._id } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res
        .status(200)
        .json({
          message: "Comment added successfully",
          product: updatedProduct,
        });
    } catch (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  listDetailComment: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate that the ID is valid (optional)
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          err: 1,
          msg: "Invalid product ID",
          status: 400,
        });
      }

      // Find the product by ID and populate comments with user data
      const product = await modelProduct.findById(id).populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name avatar", // Select specific user fields if needed
        },
      });

      // Check if product was found
      if (!product) {
        return res.status(404).json({
          success: false,
          err: 1,
          msg: "Product not found",
          status: 404,
        });
      }

      return res.status(200).json({
        success: true,
        err: 0,
        msg: "OK",
        status: 200,
        comments: product.comments,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        err: 1,
        msg: "System error",
        status: 500,
        error: error.message,
      });
    }
  },
  getCommentDelete: async (req, res) => {
    try {
      const disabledComments = await modelComment.Comment.find({
        status: "disable",
      });
      if (!disabledComments || disabledComments.length === 0) {
        return res
          .status(404)
          .json({
            message: "Không tìm thấy bình luận nào có trạng thái 'disable'",
          });
      }
      res.status(200).json(disabledComments);
    } catch (error) {
      console.error("Error fetching disabled comments:", error);
      res
        .status(500)
        .json({
          success: false,
          err: 3,
          msg: "Lỗi hệ thống",
          status: 500,
          error: error.message,
        });
    }
  },

  softDelete: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({
          success: false,
          err: 1,
          msg: "ID sản phẩm không hợp lệ",
          status: 400,
        });
      }
      const softDeletedComment = await modelComment.Comment.findByIdAndUpdate(
        id,
        { status: "disable" },
        { new: true }
      );
      if (!softDeletedComment) {
        return res.status(404).json({
          success: false,
          err: 1,
          msg: "Không tìm thấy sản phẩm",
          status: 404,
        });
      }

      res.status(200).json({
        success: true,
        err: 0,
        msg: "Đã xóa thành công",
        status: 200,
        data: softDeletedComment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        err: 1,
        msg: "Lỗi server",
        status: 500,
        error: error.message,
      });
    }
  },
};

module.exports = commentController;
