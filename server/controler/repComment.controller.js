const repCommentService = require("../services/repComment.service");
const modelProduct = require("../model/product_v2");
const Repcomment = require("../model/repComment.model");
const modelComment = require("../model/comment.model");
const mongoose = require("mongoose");
const commmentService = require("../services/comment.service");
const repCommentController = {
  repComment: async (req, res) => {
    try {
      let { content, id_comment, createdAt } = req.body;

      if (!content || !id_comment) {
        return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
      }

      createdAt = createdAt ? new Date(createdAt) : new Date();

      let data = { content, id_comment, createdAt };

      // Save reply comment to the database
      const savedRepComment = await repCommentService.createRepComment(data);
      res
        .status(201)
        .json({
          message: "Phản hồi bình luận được tạo thành công",
          savedRepComment,
        });
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  },
  getRepComment: async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await repCommentService.findRepCommentsByCommentId(id);
      // if (comments.length === 0) {
      //   return res
      //     .status(404)
      //     .json({ message: "Không tìm thấy phản hồi cho bình luận này" });
      // }
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching reply comments:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
  createRepComment: async (req, res) => {
    try {
      const { idComment } = req.params;
      const { content } = req.body;

      if (!content || !idComment) {
        return res
          .status(400)
          .json({ message: "Content, idComment và id_user là bắt buộc" });
      }

      const comment = await modelComment.Comment.findById(idComment);
      if (!comment) {
        return res.status(404).json({ message: "Comment không tồn tại" });
      }

      const newRepComment = new Repcomment({
        content,
        id_comment: idComment,
      });

      const savedRepComment = await newRepComment.save();
      console.log("Bình luận trả lời đã được tạo:", savedRepComment);

      // Cập nhật bình luận gốc để thêm bình luận trả lời vào trường replies
      comment.replies = [...(comment.replies || []), savedRepComment._id]; // Thêm ID của bình luận trả lời vào replies
      await comment.save(); // Lưu cập nhật vào bình luận

      return res.status(201).json(savedRepComment);
    } catch (error) {
      console.error("Lỗi khi tạo bình luận trả lời:", error);
      return res
        .status(500)
        .json({ message: "Lỗi khi tạo bình luận trả lời", error });
    }
  },

  deleteRepComment: async (req, res) => {
    try {
      const { idRepComment } = req.params;
  
      // Kiểm tra ID hợp lệ
      if (!idRepComment || idRepComment.length !== 24) {
        return res.status(400).json({
          success: false,
          err: 1,
          msg: "Invalid reply comment ID",
          status: 400,
        });
      }
  
      // Tìm `Comment` chứa `idRepComment` trong trường `replies`
      const parentComment = await modelComment.Comment.findOne({ replies: idRepComment });
  
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          err: 1,
          msg: "No parent comment found for this reply comment",
          status: 404,
        });
      }
  
      // Xóa `idRepComment` khỏi trường `replies` của `Comment`
      parentComment.replies = null; // Gán null vì `replies` không phải là mảng
      await parentComment.save();
  
      // Xóa `RepComment` khỏi bảng `Repcomment`
      const deletedRepComment = await Repcomment.findByIdAndDelete(idRepComment);
  
      if (!deletedRepComment) {
        return res.status(404).json({
          success: false,
          err: 1,
          msg: "Reply comment not found",
          status: 404,
        });
      }
  
      console.log("Successfully deleted reply comment:", deletedRepComment);
      return res.status(200).json({
        success: true,
        msg: "Successfully deleted reply comment and updated parent comment",
        data: deletedRepComment,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        success: false,
        err: 1,
        msg: "System error",
        status: 500,
        error,
      });
    }
  },
  
  

};

module.exports = repCommentController;
