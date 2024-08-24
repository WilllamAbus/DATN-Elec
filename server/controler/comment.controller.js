const  commentService = require('../services/comment.service')


const commentController = {
    userID : async (req, res) => {
        try {
            const { id } = req.params;
            const user = await commentService.findUserById(id);
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy người dùng" });
            }
    
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },

    comment : async (req, res) => {
        try {
            let { content, id_product, id_user, rating, createdAt } = req.body;
    
            if (!content || !id_product || !id_user || !rating) {
                return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
            }
    
            createdAt = createdAt ? new Date(createdAt) : new Date();
            let data = { content, id_product, id_user, rating, createdAt };
    
            // Save comment to database
            const savedComment = await commentService.createComment(data);
            res.status(201).json({ message: "Bình luận được tạo thành công", savedComment });
        } catch (error) {
            console.error('Lỗi khi thêm bình luận:', error);
            res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
        }
    },


    commentProduct : async (req, res) => {
        try {
            const { id } = req.params;
            const comments = await commentService.findCommentsByProductId(id);
            if (comments.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
            }
            res.status(200).json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },


    deleteComment : async (req, res) => {
        try {
            const { id } = req.params;
            const comment = await commentService.findCommentById(id);
    
            if (!comment) {
                return res.status(404).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
            }
    
            await commentService.deleteCommentById(id);
            res.status(200).json({ message: "Bình luận đã được xóa thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    },

    getAllComments : async (req, res) => {
        try {
            const { page = 1, pageSize = 5 } = req.query;
            const result = await commentService.getAllComment(page, pageSize);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching comments:", error);
            res.status(500).json({ message: "Failed to fetch comments" });
        }
    },

    softDeleteComment : async (req, res) => {
        try {
            const { id } = req.params;
            const result = await commentService.softDeleteComment(id);
            if (!result) {
                return res.status(404).json({ message: "Comment not found" });
            }
            res.status(200).json({ message: "Comment soft deleted successfully", result });
        } catch (error) {
            console.error("Error soft deleting comment:", error);
            res.status(500).json({ message: "Failed to soft delete comment" });
        }
    },

    getDeletedComments : async (req, res) => {
        try {
            const { page = 1, pageSize = 5 } = req.query;
            const result = await commentService.deletedListComment(page, pageSize);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching deleted comments:", error);
            res.status(500).json({ message: "Failed to fetch deleted comments" });
        }
    },

    restoreComment : async (req, res) => {
        try {
            const { id } = req.params;
            const result = await commentService.restore(id);
            if (!result) {
                return res.status(404).json({ message: "Comment not found" });
            }
            res.status(200).json({ message: "Comment restored successfully", result });
        } catch (error) {
            console.error("Error restoring comment:", error);
            res.status(500).json({ message: "Failed to restore comment" });
        }
    },

    getSuggestions : async (req, res) => {
        try {
            const { query, limit = 5 } = req.query;
            const suggestions = await commentService.getSuggestions(query, limit);
            res.status(200).json(suggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            res.status(500).json({ message: "Failed to fetch suggestions" });
        }
    },

    searchCommentsAdmin : async (req, res) => {
        try {
            const { query, page = 1, pageSize = 10 } = req.query;
            const result = await commentService.searchCommentAdmin(query, page, pageSize);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error searching comments:", error);
            res.status(500).json({ message: "Failed to search comments" });
        }
    }
    
}


module.exports = commentController