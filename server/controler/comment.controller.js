const  commentService = require('../services/comment.service');
const modelProduct = require(`../model/product_v2/index`);
const mongoose = require('mongoose'); 

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
    },
    getCommentProduct: async (req, res) => {
      try {
          const { id } = req.params;
  
          // Tìm sản phẩm theo ID và chỉ lấy trường comments
          const product = await modelProduct.findById(id, 'comments');
  
          if (!product || product.comments.length === 0) {
              return res.status(404).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
          }
  
          // Sắp xếp các bình luận theo thời gian tạo (giả sử bạn có trường createdAt)
          const sortedComments = product.comments.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
          });
  
          res.status(200).json(sortedComments);
      } catch (error) {
          console.error("Error fetching comments:", error);
          res.status(500).json({ message: "Lỗi server" });
      }
  },
  
    getCommentAdmin : async (req, res) => {
        try {
            console.log('Request data:', req.body); // Hoặc req.params tùy thuộc vào cách bạn nhận dữ liệu
    
            const productsWithComments = await modelProduct.find({ 'comments.0': { $exists: true } }).populate('comments');
    
            if (!productsWithComments || productsWithComments.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm nào có bình luận" });
            }
    
            res.status(200).json(productsWithComments);
        } catch (error) {
            console.error("Error fetching products with comments:", error);
            res.status(500).json({ success: false, err: 3, msg: "Lỗi hệ thống", status: 500, error: error.message });
        }
    },
    deleteComment : async (req, res) => {
        try {
          const { idProduct, idComment } = req.params;
          // console.log("Received idProduct:", idProduct);
          // console.log("Received idComment:", idComment);
          if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            return res.status(400).json({
              success: false,
              err: 1,
              msg: 'Invalid product ID',
              status: 400,
            });
          }
          if (!mongoose.Types.ObjectId.isValid(idComment)) {
            return res.status(400).json({
              success: false,
              err: 1,
              msg: 'Invalid comment ID',
              status: 400,
            });
          }
      
          const product = await modelProduct.findByIdAndUpdate(
            idProduct,
            {
              $pull: { comments: { _id: idComment } },
            },
            { new: true } 
          );
      
          if (!product) {
            return res.status(404).json({
              success: false,
              err: 1,
              msg: 'Product not found',
              status: 404,
            });
          }
      
          return res.status(200).json({
            success: true,
            err: 0,
            msg: 'Comment deleted successfully',
            status: 200,
            comments: product.comments, 
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            err: 1,
            msg: 'System error',
            status: 500,
            error: error.message,
          });
        }
    },
    addCommentProduct : async (req, res) => {
        try {
          const productId = req.params.id; 
          const commentData = req.body; 
      
          if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
          }
      
          const updatedProduct = await modelProduct.findByIdAndUpdate(
            productId,
            { $push: { comments: commentData } },
            { new: true, runValidators: true } 
          );
      
          if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
          }
      
          return res.status(200).json({ message: 'Comment added successfully', product: updatedProduct });
        } catch (error) {
          console.error('Error adding comment:', error);
          return res.status(500).json({ error: error.message });
        }
      },
    listDetailComment : async (req, res) => {
        try {
          const { id } = req.params;
      
          // Validate that the ID is valid (optional)
          if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
              success: false,
              err: 1,
              msg: 'Invalid product ID',
              status: 400,
            });
          }
      
          // Find the product by ID and populate comments with user data
          const product = await modelProduct.findById(id)
            .populate({
              path: 'comments',
              populate: {
                path: 'user',
                select: 'name avatar' // Select specific user fields if needed
              }
            });
      
          // Check if product was found
          if (!product) {
            return res.status(404).json({
              success: false,
              err: 1,
              msg: 'Product not found',
              status: 404,
            });
          }
      
          return res.status(200).json({
            success: true,
            err: 0,
            msg: 'OK',
            status: 200,
            comments: product.comments,
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            err: 1,
            msg: 'System error',
            status: 500,
            error: error.message,
          });
        }
      },
     getCommentAdmin : async (req, res) => {
        try {
          const products = await modelProduct.find({
            'comments.0': { $exists: true } 
          }).populate({
            path: 'comments' 
          });
      
          return res.status(200).json({
            success: true,
            err: 0,
            msg: 'OK',
            status: 200,
            products
          });
        } catch (error) {
          console.error('Lỗi khi lấy bình luận:', error);
          return res.status(500).json({
            success: false,
            err: 1,
            msg: 'Lỗi hệ thống',
            status: 500,
            error: error.message,
          });
        }
      }
}


module.exports = commentController