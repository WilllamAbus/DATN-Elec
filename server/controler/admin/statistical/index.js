const ProductV2 = require("../../../model/product_v2");
const Inventory = require("../../../model/inventory/inventory.model");
const Order = require("../../../model/orders/orderCart/orders");
const OrderDetail = require("../../../model/orders/orderCart/OrderDetails");
const OrderCart = require("../../../model/orders/orderCart/orders");
const Categories = require(`../../../model/catgories.model`);
const modelComment = require("../../../model/comment.model");
const modelViewProduct = require("../../../model/product_v2/productVariant");
const modelUser = require("../../../model/users.model");
const modelProductAucation = require("../../../model/productAuction/productAuction");
const removeAccents = require('remove-accents');
const mongoose = require('mongoose');
const statisticalController = {
  // top sản phẩm có lượt xem
  topViewProduct: async (req, res) => {
    try {
      const number = parseInt(req.query.number) || 5; // Lấy số lượng sản phẩm top cần hiển thị (mặc định là 5)
  
      const products = await modelViewProduct.aggregate([
        {
          $group: {
            _id: "$product", // Nhóm theo ID sản phẩm (hoặc trường tương ứng mà bạn muốn nhóm)
            totalViewCount: { $sum: "$viewCount" }, // Cộng dồn `viewCount` của các sản phẩm giống nhau
            productName: { $first: "$variant_name" },
            productPrice: { $first: "$variant_price" }, // Lấy giá sản phẩm đầu tiên
          },
        },
        {
          $lookup: {
            from: "product_v2", // Tên collection chứa thông tin sản phẩm
            localField: "_id", // Trường `product` trong `modelViewProduct` sẽ kết nối với `_id` trong `product_v2`
            foreignField: "_id", // Kết nối với trường `_id` của collection `product_v2`
            as: "productInfo", // Kết quả của lookup sẽ lưu vào trường `productInfo`
          },
        },
        {
          $unwind: "$productInfo", // Giải nén mảng `productInfo` thành các trường riêng biệt
        },
        {
          $project: {
            _id: 0, // Ẩn `_id` gốc
            userId: "$_id", // Giữ lại ID của sản phẩm
            productName: 1, // Giữ lại tên sản phẩm
            productPrice: 1, // Giữ lại giá sản phẩm
            totalViewCount: 1, // Giữ lại tổng số lượt xem
            image: "$productInfo.image", // Lấy trường hình ảnh từ `product_v2`
          },
        },
        {
          $sort: { totalViewCount: -1 }, // Sắp xếp sản phẩm theo số lượng viewCount giảm dần
        },
        {
          $limit: number, // Giới hạn số lượng sản phẩm lấy được (top `number` sản phẩm)
        },
      ]);
      
      
      
  
      return res.status(200).json({
        success: true,
        message: "Top products fetched successfully",
        data: products,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error fetching top products",
        error: err.message,
      });
    }
  },
  
  // số lượng tổng sản phẩm
  totalQuantityProduct: async (req, res) => {
    try {
      const total = await Inventory.aggregate([
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$totalQuantity" },
          },
        },
      ]);

      res.status(200).json({
        success: true,
        message: "Total quantity fetched successfully",
        data: total.length > 0 ? total[0].totalQuantity : 0,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching total quantity",
        error: error.message,
      });
    }
  },
  //đơn hàng đang chờ
  pendingOrder: async (req, res) => {
    try {
      const orders = await Order.find({ stateOrder: "Chờ xử lý" });
      res.status(200).json({
        success: true,
        message: "Total quantity fetched successfully",
        data: orders.length,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching orders",
      });
    }
  },
  //danh mục
  totalCategories: async (req, res) => {
    try {
      const activeCategories = await Categories.find({ status: "active" });
      const allCategories = await Categories.find();
      res.status(200).json({
        success: true,
        message: "Total categories fetched successfully",
        data: {
          activeCategories: activeCategories.length,
          totalCategories: allCategories.length,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching categories",
      });
    }
  },
  //đơn hàng đã bán(lấy sl từ OrderDetail)
  totalProductsSold: async (req, res) => {
    try {
      const orderDetails = await OrderDetail.find();
      const totalQuantity = orderDetails.reduce((total, order) => {
        return (
          total +
          order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0)
        );
      }, 0);

      res.status(200).json({
        success: true,
        message: "Total products sold fetched successfully",
        totalProductsSold: totalQuantity,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching total products sold",
      });
    }
  },
  //trạng thái danh mục và sản phẩm
  productCate: async (req, res) => {
    try {
      // Lấy danh mục đang hoạt động (active)
      const activeCategories = await Categories.find({
        status: "active",
      }).select("_id");

      // Lấy danh mục không hoạt động (disable)
      const disabledCategories = await Categories.find({
        status: "disable",
      }).select("_id");

      // Chuyển danh sách _id của danh mục active và disable thành mảng các id
      const activeCategoryIds = activeCategories.map(
        (categories) => categories._id
      );
      const disabledCategoryIds = disabledCategories.map(
        (categories) => categories._id
      );

      // Lấy sản phẩm thuộc danh mục active
      const activeProducts = await ProductV2.find({
        product_type: { $in: activeCategoryIds },
      });

      // Lấy sản phẩm thuộc danh mục disable
      const disabledProducts = await ProductV2.find({
        product_type: { $in: disabledCategoryIds },
      });

      // Trả về dữ liệu
      res.status(200).json({
        success: true,
        message: "Lấy sản phẩm thành công",
        data: {
          activeProducts,
          disabledProducts,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra",
        error: error.message,
      });
    }
  },
  //sl sản phẩm trong danh mục
  productByCategoryActive: async (req, res) => {
    try {
      // Sử dụng aggregate để kết hợp danh mục và đếm số lượng sản phẩm trong mỗi danh mục
      const categories = await Categories.aggregate([
        {
          $match: { status: "active" },
        },
        {
          $lookup: {
            from: "product_v2", // Tên của collection product
            localField: "_id", // Khóa chính của bảng category
            foreignField: "product_type", // Khóa ngoại trong bảng product
            as: "products", // Tên field kết hợp
          },
        },
        {
          $project: {
            _id: 1,
            name: 1, // Chỉ lấy các trường cần thiết từ category
            productCount: { $size: "$products" }, // Đếm số lượng sản phẩm trong danh mục
          },
        },
      ]);

      res.status(200).json(categories); // Trả về danh sách danh mục và số lượng sản phẩm
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi tải danh mục và sản phẩm" });
    }
  },
  productByCategoryDisable: async (req, res) => {
    try {
      // Sử dụng aggregate để kết hợp danh mục và đếm số lượng sản phẩm trong mỗi danh mục
      const categories = await Categories.aggregate([
        {
          $match: { status: "disable" },
        },
        {
          $lookup: {
            from: "product_v2", // Tên của collection product
            localField: "_id", // Khóa chính của bảng category
            foreignField: "product_type", // Khóa ngoại trong bảng product
            as: "products", // Tên field kết hợp
          },
        },
        {
          $project: {
            _id: 1,
            name: 1, // Chỉ lấy các trường cần thiết từ category
            productCount: { $size: "$products" }, // Đếm số lượng sản phẩm trong danh mục
          },
        },
      ]);

      res.status(200).json(categories); // Trả về danh sách danh mục và số lượng sản phẩm
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi tải danh mục và sản phẩm" });
    }
  },
  topComments: async (req, res) => {
    try {
      const topComments = await modelComment.Comment.aggregate([
        {
          $match: {
            status: "active", // Lọc theo trạng thái "active"
            likes: { $exists: true, $not: { $size: 0 } }, // Kiểm tra likes tồn tại và không rỗng
          },
        },
        {
          $project: {
            _id: 1, // Giữ lại ID của comment
            id_user: 1, // Giữ lại ID của user
            likesCount: { $size: "$likes" }, // Tạo trường `likesCount` chứa số lượng likes
            content: 1, // Giữ lại nội dung comment (nếu cần)
            createdAt: 1, 
          },
        },
        {
          $sort: { likesCount: -1 }, // Sắp xếp theo số lượng likesCount giảm dần
        },
        {
          $limit: 3, // Giới hạn chỉ lấy 3 comment có số lượt like cao nhất
        },
        {
          $lookup: {
            from: "users", // Kết nối với bảng users
            localField: "id_user", // Liên kết qua trường `id_user` trong comment
            foreignField: "_id", // Liên kết với `_id` trong bảng users
            as: "userInfo", // Kết quả lưu vào trường `userInfo`
          },
        },
        {
          $unwind: "$userInfo", // Giải nén mảng `userInfo` thành đối tượng
        },
        {
          $project: {
            _id: 1, // Giữ lại ID của comment
            content: 1, // Giữ lại nội dung comment
            likesCount: 1, // Giữ lại số lượt like
            createdAt: 1,
            userName: "$userInfo.name", // Lấy tên user
            userAvatar: "$userInfo.avatar", // Lấy avatar của user
          },
        },
      ]);
  
      if (topComments.length > 0) {
        return res.status(200).json(topComments); // Trả về danh sách comment
      }
  
      // Trả về 404 nếu không tìm thấy comment
      return res.status(404).json({ message: "Không có comment nào thỏa mãn điều kiện" });
    } catch (error) {
      console.error("Error fetching top comments:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi khi lấy danh sách top comment" });
    }
  },
  totalUser: async (req, res) => {
    try {
      // Tìm tất cả người dùng có trạng thái 'active'
      const response = await modelUser.find({ status: 'active' });
  
      // Trả về kết quả
      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error(error);
  
      // Trả về lỗi
      res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    }
  },
  //doanh thu 
  revenue: async (req, res) => {
    try {
      const { startDate, endDate, page = 1, limit = 5 } = req.query; // Nhận tham số từ query params
      const filter = {};
  
      // Xử lý lọc theo khoảng thời gian
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)), // Từ đầu ngày
          $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)), // Đến cuối ngày
        };
      } else if (startDate) {
        filter.createdAt = {
          $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
          $lte: new Date(new Date(startDate).setHours(23, 59, 59, 999)),
        };
      } else if (endDate) {
        filter.createdAt = {
          $gte: new Date(new Date(endDate).setHours(0, 0, 0, 0)),
          $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        };
      }
  
      // Bước 1: Lấy danh sách đơn hàng từ model Order có stateOrder là "Hoàn tất"
      const completedOrders = await OrderCart.find({ stateOrder: "Hoàn tất" }).select("_id");
  
      // Bước 2: Tính tổng doanh thu chỉ từ các OrderDetail liên quan đến đơn hàng hoàn tất
      const totalRevenueResult = await OrderDetail.aggregate([
        {
          $match: {
            ...filter, // Thêm điều kiện lọc theo thời gian
            order: { $in: completedOrders.map(order => order._id) }, // Chỉ lấy các OrderDetail liên quan đến đơn hàng hoàn tất
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalItemPrice" }, // Tính tổng trường totalItemPrice
          },
        },
      ]);
  
      const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
  
      // Bước 3: Lấy các OrderDetail liên quan đến danh sách đơn hàng này
      const orderDetails = await OrderDetail.find({
        ...filter, // Áp dụng điều kiện lọc theo thời gian
        order: { $in: completedOrders.map(order => order._id) }, // Lọc theo đơn hàng hoàn tất
      })
        .populate([
          { path: "order", model: "OrderCart" },
          { path: "items.product", model: "product_v2" },
          { path: "items.productVariant", model: "productVariant" },
          { path: "itemAuction.product_randBib", model: "productAuction" },
        ])
        .select("createdAt items itemAuction order") // Chọn thêm các trường liên quan
        .sort({ createdAt: -1 });
  
      // Gộp sản phẩm từ items và itemAuction
      const allProducts = orderDetails.flatMap((order) => {
        return [
          ...(order.items || []).map((item) => ({
            ...item.toObject(),
            createdAt: order.createdAt, // Gắn createdAt của OrderDetail vào từng item
          })),
          ...(order.itemAuction || []).map((item) => ({
            ...item.toObject(),
            createdAt: order.createdAt, // Gắn createdAt của OrderDetail vào từng item
          })),
        ];
      });
  
      // Tính tổng số trang
      const totalProducts = allProducts.length;
      const totalPages = Math.ceil(totalProducts / limit);
  
      // Áp dụng phân trang
      const paginatedProducts = allProducts.slice(
        (page - 1) * limit,
        page * limit
      );
  
      // Trả về kết quả
      res.status(200).json({
        success: true,
        message: "Products and revenue fetched successfully",
        data: {
          totalRevenue,
          products: paginatedProducts,
          totalPages,
          currentPage: Number(page),
        },
      });
    } catch (error) {
      console.error("Error in fetching products and revenue:", error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },
  
   updateNormalizedNames : async (req, res) => {
    try {
      // Lấy tất cả các sản phẩm từ database
      const products = await ProductV2.find();
  
      // Lập qua từng sản phẩm và cập nhật trường normalized_name
      const updatePromises = products.map((product) => {
        const normalizedName = removeAccents(product.product_name || '')
          .toLowerCase()
          .replace(/\s+/g, ' ');
  
        return ProductV2.updateOne(
          { _id: product._id },
          { $set: { normalized_name: normalizedName } }
        );
      });
  
      // Chờ tất cả các cập nhật hoàn thành
      await Promise.all(updatePromises);
  
      console.log('All products updated with normalized_name.');
    } catch (err) {
      console.error('Error updating products:', err);
    } finally {
      // Đóng kết nối MongoDB
      mongoose.connection.close();
    }
  },
  
 
  
  
  
  
  
  
  
  
  
  
  
};

module.exports = statisticalController;
