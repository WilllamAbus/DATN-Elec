const modelComment = require('../model/comment.model');
const modelUser = require('../model/users.model');

const commmentService = {
    findUserById : async (id) => {
        return await modelUser.findById(id);
    },
    createComment : async (data) => {
        return await modelComment.create(data);
    },

    findCommentsByProductId : async (productId) => {
        return await modelComment.find({ id_product: productId });
    },

    deleteCommentById : async (id) => {
        return await modelComment.findByIdAndDelete(id);
    },


    getAllComment:  async (page = 1, pageSize = 5) => {
        try {
          // Validate page and pageSize parameters
          const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
          const size = parseInt(pageSize, 5) > 0 ? parseInt(pageSize, 5) : 5;
      
          // Calculate the number of documents to skip
          const skip = (pageNumber - 1) * size;
      
          // Fetch the paginated list of active discounts
          const [comments, totalCount] = await Promise.all([
            modelComment.find({ status: { $ne: "disable" } })
                      .skip(skip)
                      .limit(size),
            modelComment.countDocuments({ status: { $ne: "disable" } })
          ]);
          
          // Return the list of discounts along with pagination info
          return {
            comments: Array.isArray(comments) ?comments : [],
            pagination: [
              {   page: pageNumber,
                pageSize: size,
                total: totalCount,
                totalPages: Math.ceil(totalCount / size),
              }
            ]
           
            }
          
        } catch (error) {
          console.error("Error fetching discounts:", error);
          throw new Error("Failed to fetch discounts");
        }
      },


      softDeleteComment: async (id) => {
        try {
            // const adminRole = await Role.findOne({ name: 'admin' });
    
    
            // if (!adminRole) {
            //     return res.status(500).json({ message: "Không tìm thấy vai trò quản trị viên" });
            // }
    
    
            // const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
    
            // if (!isAdmin) {
            //     return res.status(403).json({ message: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể cập nhật sản phẩm" });
            // }
            const nowUtc = new Date();
        
            // Chuyển đổi thời gian UTC về múi giờ Việt Nam
            // Múi giờ Việt Nam là UTC + 7 giờ
            const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
            const now = new Date(nowUtc.getTime() + offset);
        
            const softDeleteComment = await modelComment.Comment.findByIdAndUpdate(
                id,
                { status: "disable",   disabledAt: now },
                
                { new: true }
              );
          return softDeleteComment
        } catch (error) {
          console.error(error);
        }
      },
      deletedListComment:async (page = 1, pageSize = 5) => {
        try {
          // Validate page and pageSize parameters
          const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
          const size = parseInt(pageSize, 5) > 0 ? parseInt(pageSize, 5) : 5;
      
          // Calculate the number of documents to skip
          const skip = (pageNumber - 1) * size;
      
          // Fetch the paginated list of deleted discounts
          const [deletedComment, totalCount] = await Promise.all([
          modelComment.Comment.find({ status: "disable" })  // Assuming "disable" status indicates deletion
                      .skip(skip)
                      .limit(size),
            modelComment.Comment.countDocuments({ status: "disable" })
          ]);
          
          // Return the list of deleted discounts along with pagination info
          return {
           deletedComment: Array.isArray(deletedComment) ? deletedComment : [],
            pagination: [{
              page: pageNumber,
              pageSize: size,
              total: totalCount,
              totalPages: Math.ceil(totalCount / size),
            }]
          };
        } catch (error) {
          console.error("Error fetching deleted discounts:", error);
          throw new Error("Failed to fetch deleted discounts");
        }
    },
      restore: async (id) => {
        try {
          
            const restore =  await modelComment.Comment.findByIdAndUpdate(
                id,
                { status: "active" },
                { new: true }
              );
         return restore
        } catch (error) {
          console.error(error);
        }
      },

      getSuggestions : async (query, limit = 5) => {
        try {
            const suggestions = await modelComment.find({
                content: { $regex: query, $options: 'i' },
                status: { $ne: 'disable' }
            })
                .select(' content slug')
                .limit(limit)
                .exec();
    
            return suggestions;
        } catch (err) {
            console.error('Error fetching product suggestions:', err);
            throw new Error('Failed to fetch product suggestions');
        }
    },
    searchCommentAdmin: async(query, page = 1, pageSize = 10)=>{
        const limit = parseInt(pageSize, 10); // Number of products per page
        const skip = (parseInt(page, 10) - 1) * limit; // Number of products to skip
    
        try {
            // Build the search query
            const searchQuery = {
                $or: [
                    { content: { $regex: query, $options: 'i' } }, // Case-insensitive search for product name
                    { slug: { $regex: query, $options: 'i' } } // Case-insensitive search for product description
                ],
                status: { $ne: 'disable' } // Exclude disabled products
            };
    
            // Fetch products based on the search query
            const comments = await modelComment.find(searchQuery)
                .limit(limit)
                .skip(skip)
                .exec();
    
            const totalComment = await modelComment.countDocuments(searchQuery); // Get the total number of matching products
            const totalPages = Math.ceil( totalComment / limit);
    
            return {
                comments,
                pagination: {
                    page: parseInt(page, 10),
                    pageSize: limit,
                    totalComment,
                    totalPages,
                },
            };
        } catch (err) {
            console.error('Error searching products:', err);
            throw new Error('Failed to search products');
        }
    },
};

module.exports = commmentService