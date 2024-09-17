const repCommentService = require('../services/repComment.service');
const modelProduct = require('../model/product_v2');
const Repcomment = require('../model/repComment.model');
const mongoose = require('mongoose'); 
const commmentService = require('../services/comment.service');
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
            res.status(201).json({ message: "Phản hồi bình luận được tạo thành công", savedRepComment });
        } catch (error) {
            console.error('Lỗi khi thêm phản hồi:', error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },
    getRepComment: async (req, res) => {
        try {
            const { id } = req.params; 
            const comments = await repCommentService.findRepCommentsByCommentId(id);
            if (comments.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy phản hồi cho bình luận này" });
            }
            res.status(200).json(comments);
        } catch (error) {
            console.error("Error fetching reply comments:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },
    createRepComment : async (req, res) => {
        try {
          const { idComment } = req.params;  
          const { content } = req.body;      
          if (!content || !idComment) {
            return res.status(400).json({ message: 'Content and idComment are required' });
          }
          const newRepComment = new Repcomment({
            content,
            id_comment: idComment,
          });
          const savedRepComment = await newRepComment.save();
      
          const product = await modelProduct.findOne({ 'comments._id': idComment });
          if (!product) {
            return res.status(404).json({ message: 'Comment not found in the product' });
          }
          console.log('Bình luận trả lời đã được tạo:', savedRepComment);
          return res.status(201).json(savedRepComment);
        } catch (error) {
          console.error('Lỗi khi tạo bình luận trả lời:', error);
          return res.status(500).json({ message: 'Lỗi khi tạo bình luận trả lời', error });
        }
    },
    deleteRepComment : async (req, res) => {
        try {
            const { idRepComment } = req.params;
    
            // Kiểm tra ID có hợp lệ không
            if (!idRepComment|| idRepComment.length !== 24) {
                return res.status(400).json({
                    success: false,
                    err: 1,
                    msg: 'Invalid comment ID',
                    status: 400
                });
            }
    
            // Tìm và xóa bình luận dựa trên ID
            const deletedRepComment = await Repcomment.findByIdAndDelete(idRepComment);
    
            if (!deletedRepComment) {
                return res.status(404).json({
                    success: false,
                    err: 1,
                    msg: 'No reply comment found with this ID',
                    status: 404
                });
            }
    
            console.log('Successfully deleted:', deletedRepComment);
            return res.status(200).json({
                success: true,
                msg: 'Successfully deleted',
                data: deletedRepComment
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                success: false,
                err: 1,
                msg: 'System error',
                status: 500,
                error
            });
        }
    }

};

module.exports = repCommentController;