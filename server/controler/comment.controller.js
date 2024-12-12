const commentService = require("../services/comment.service");
const modelProduct = require(`../model/product_v2/index`);
const modelRepComment = require("../model/repComment.model");
const modelUser = require("../model/users.model");
const modelComment = require("../model/comment.model");
// const modelProductVariants = require ('../model/recommendation/interaction.model')
const mongoose = require("mongoose");
const interactionService = require("../services/interaction/interation.service");
const path = require("path");
const { spawn } = require("child_process");


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
      const { slug } = req.params;
      const comments = await commentService.findCommentsByProductId(slug);
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
      const { slug } = req.params;
      const rating = req.query.rating ? parseInt(req.query.rating, 10) : null;
  
      // Tìm sản phẩm theo slug và populate thông tin
      const product = await modelProduct.findOne({ slug }).populate({
        path: "comments",
        model: "Comment",
        match: {
          status: "active",
          ...(rating !== null && { rating }), // Lọc theo rating nếu có
        },
        select: "content rating id_user id_product createdAt likes", // Lấy các trường cần thiết
        options: { sort: { createdAt: -1 } }, // Sắp xếp từ mới nhất
        populate: {
          path: "id_user", // Liên kết tới bảng User qua id_user
          model: "users",
          select: "name avatar", // Chỉ lấy name và avatar từ User
        },
      });
  
      // Kiểm tra nếu không tìm thấy sản phẩm hoặc không có bình luận nào
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      if (!product.comments || product.comments.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy bình luận cho sản phẩm này" });
      }
  
      // Trả về danh sách bình luận
      res.status(200).json(product.comments);
    } catch (error) {
      console.error("Lỗi khi lấy bình luận sản phẩm:", error.message);
      res.status(500).json({ message: "Đã xảy ra lỗi khi xử lý yêu cầu" });
    }
  },
  

  getCommentAdmin: async (req, res) => {
    try {
      // Lấy giá trị limit và page từ query parameters
      const limit = parseInt(req.query.limit) || 2;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;

      // Đếm tổng số lượng sản phẩm có bình luận
      const totalItems = await modelProduct.countDocuments({
        "comments.0": { $exists: true },
      });

      // Tính tổng số trang dựa trên tổng số lượng sản phẩm và limit
      const totalPages = Math.ceil(totalItems / limit);

      // Lấy dữ liệu sản phẩm với bình luận theo phân trang
      const productsWithComments = await modelProduct
        .find({ "comments.0": { $exists: true } })
        .skip(skip)
        .limit(limit)
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

      // Trả về dữ liệu với thông tin phân trang
      res.status(200).json({
        success: true,
        data: productsWithComments,
        page: page,
        limit: limit,
        totalPages: totalPages, // Thêm tổng số trang vào kết quả trả về
        totalItems: totalItems, // Thêm tổng số lượng sản phẩm có bình luận
      });
    } catch (error) {
      console.error("Error fetching products with comments:", error);
      res.status(500).json({
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
        const slug = req.params.slug;
        const commentData = req.body;

        // Tìm sản phẩm bằng slug để lấy productId
        const product = await modelProduct.findOne({ slug: slug });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const productId = product._id; // Lấy productId từ sản phẩm tìm thấy

        // Lấy idProductVariant từ product
        let idProductVariant;
        if (Array.isArray(product.variants) && product.variants.length > 0) {
            idProductVariant = product.variants[0]._id; // Lấy _id từ variant đầu tiên
        } else {
            console.log("Product Variants is not an array or is empty:", product.variants);
            return res.status(404).json({ error: "Product variant not found" });
        }

        // Kiểm tra nếu không có id_user trong commentData
        if (!commentData.id_user) {
            return res.status(400).json({ error: "User ID is required" });
        }

        commentData.id_product = productId;
        commentData.likes = []; // Khởi tạo mảng likes rỗng cho comment mới

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

        // Tạo interaction
        const interactionData = {
            user: commentData.id_user,
            orderAuctions: null,
            OrderCart: null,
            productVariant: idProductVariant,
            Watchlist: null,
            type: "comment",
            score: 3,
        };

        const interactionResult = await interactionService.postInteractions(interactionData);
        const pythonScriptPath = path.resolve(
          __dirname,
          "../../Python Client Server/recommendation_service.py"
        );
  
        console.log("Python Script Path:", pythonScriptPath);
  
        const pythonProcess = spawn("python", [
          pythonScriptPath,
          commentData.id_user.toString(),
        ]);
  
        pythonProcess.stdout.on("data", (data) => {
          console.log(`Python Output: ${data.toString()}`);
        });
  
        pythonProcess.stderr.on("data", (data) => {
          console.error(`Python Error: ${data.toString()}`);
        });
  
        pythonProcess.on("close", (code) => {
          if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
          } else {
            console.log(`Python script finished successfully.`);
          }
        });

        return res.status(200).json({
            message: "Comment added successfully",
            product: updatedProduct,
            interaction: interactionResult,
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ error: error.message });
    }
},


  listDetailComment: async (req, res) => {
    try {
      const { slug } = req.params;
      // Lấy giá trị số sao từ query, nếu không có sẽ mặc định là null (không lọc theo rating)
      const rating = req.query.rating ? parseInt(req.query.rating) : null;

      // Lấy số lượng bình luận mỗi trang và trang hiện tại từ query parameters
      const limit = parseInt(req.query.limit) || 10; // Mặc định là 10 bình luận mỗi trang
      const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
      const skip = (page - 1) * limit; // Tính toán số bình luận bỏ qua dựa trên trang hiện tại

      // Tìm sản phẩm dựa trên slug và phân trang bình luận của sản phẩm
      const product = await modelProduct.findOne({ slug: slug }).populate({
        path: "comments", // Đường dẫn tới mảng comments
        model: "Comment", // Model tương ứng
        match: {
          status: "active", // Điều kiện lọc chỉ lấy bình luận có trạng thái 'active'
          ...(rating !== null && { rating: rating }), // Nếu có rating thì lọc theo rating
        },
        select: "content rating id_user id_product createdAt", // Chỉ lấy các trường cần thiết
        options: {
          sort: { createdAt: -1 }, // Sắp xếp bình luận từ mới nhất đến cũ nhất
          skip: skip, // Bỏ qua số lượng bình luận cần thiết
          limit: limit, // Giới hạn số lượng bình luận trên mỗi trang
        },
        populate: {
          path: "id_user", // Liên kết tới bảng User qua id_user
          model: "users",
          select: "name avatar", // Chỉ lấy name và avatar từ User
        },
      });

      // Kiểm tra xem sản phẩm có tồn tại không
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
      }

      // Đếm tổng số bình luận của sản phẩm với các điều kiện lọc (nếu có rating)
      const totalComments = await modelComment.Comment.countDocuments({
        id_product: product._id,
        status: "active",
        ...(rating !== null && { rating: rating }), // Nếu có rating thì lọc theo rating
      });

      // Tính toán tổng số trang
      const totalPages = Math.ceil(totalComments / limit); // Tính tổng số trang

      // Trả về các bình luận và thông tin phân trang
      res.status(200).json({
        success: true,
        data: product.comments, // Trả về bình luận
        page: page,
        limit: limit,
        totalPages: totalPages,
        totalComments: totalComments,
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  getCommentDelete: async (req, res) => {
    try {
      // Lấy giá trị 'limit' và 'page' từ query parameters
      const limit = parseInt(req.query.limit) || 10; // Mặc định limit là 10 nếu không có giá trị
      const page = parseInt(req.query.page) || 1; // Mặc định page là 1 nếu không có giá trị
      const skip = (page - 1) * limit;

      // Kiểm tra nếu limit và page là các số hợp lệ
      if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
        return res.status(400).json({
          success: false,
          message: "Limit và Page phải là các số hợp lệ và lớn hơn 0.",
        });
      }

      // Đếm tổng số bình luận có trạng thái "disable"
      const totalItems = await modelComment.Comment.countDocuments({
        status: "disable",
      });

      // Tìm bình luận với phân trang
      const disabledComments = await modelComment.Comment.find({
        status: "disable",
      })
        .skip(skip) // Bỏ qua các tài liệu không thuộc trang hiện tại
        .limit(limit); // Giới hạn số tài liệu trả về

      const totalPages = Math.ceil(totalItems / limit); // Tính tổng số trang

      // Kiểm tra nếu không có bình luận nào
      if (!disabledComments || disabledComments.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bình luận nào có trạng thái 'disable'",
        });
      }

      // Phản hồi thông tin
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        comments: disabledComments,
      });
    } catch (error) {
      console.error("Error fetching disabled comments:", error);
      res.status(500).json({
        success: false,
        error: 3,
        message: "Lỗi hệ thống",
        status: 500,
        details: error.message,
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
  addLikeComment: async (req, res) => { 
    try {
      const { commentId, userId } = req.body;
  
      // Tìm bình luận cần cập nhật
      const comment = await modelComment.Comment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Kiểm tra xem người dùng đã like chưa
      if (comment.likes.includes(userId)) {
        // Nếu đã like, bỏ like
        comment.likes = comment.likes.filter(id => id.toString() !== userId);
      } else {
        // Nếu chưa like, thêm user vào mảng likes
        comment.likes.push(userId);
      }
  
      // Lưu lại thay đổi
      await comment.save();
  
      return res.json({ message: 'Like updated successfully', likes: comment.likes });
    } catch (error) {
      console.error('Error updating like:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
},
updateCommentProduct: async (req, res) => {
  try {
      const slug = req.params.slug; 
      const commentData = req.body; 
      const commentId = commentData.commentId;
      // Tìm sản phẩm bằng slug để lấy productId
      const product = await modelProduct.findOne({ slug: slug });
      if (!product) {
          return res.status(404).json({ error: "Product not found" });
      }

      // Kiểm tra nếu không có id_user trong commentData
      if (!commentData.id_user) {
          return res.status(400).json({ error: "User ID is required" });
      }

      // Tìm và cập nhật comment theo ID
      const updatedComment = await modelComment.Comment.findByIdAndUpdate(
          commentId,
          commentData, // Dữ liệu comment mới cần cập nhật
          { new: true } // Trả về comment mới sau khi cập nhật
      );

      if (!updatedComment) {
          return res.status(404).json({ error: "Comment not found" });
      }

      // Nếu cần, bạn có thể cập nhật lại product để đảm bảo tính toàn vẹn dữ liệu
      const updatedProduct = await modelProduct.findById(product._id);

      return res.status(200).json({
          message: "Comment updated successfully",
          product: updatedProduct,
          updatedComment: updatedComment,
      });
  } catch (error) {
      console.error("Error updating comment:", error);
      return res.status(500).json({ error: error.message });
  }
},


}

module.exports = commentController;
