const repCommentService = require('../services/repComment.service');

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
    }
};

module.exports = repCommentController;