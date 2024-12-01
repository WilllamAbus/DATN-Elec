const ProductV2 = require("../../../model/product_v2");
const Inventory = require("../../../model/inventory/inventory.model");
const Order = require("../../../model/orders/orderCart/orders");
const OrderDetail = require("../../../model/orders/orderCart/OrderDetails");
const Categories = require(`../../../model/catgories.model`);
const statisticalController = {
  // top sản phẩm có lượt xem
  topViewProduct: async (req, res) => {
    try {
      const number = parseInt(req.query.number) || 5;
      const products = await ProductV2.find()
        .sort({ product_view: -1 })
        .limit(number);
      res.status(200).json({
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
                $match: { status: "active" } 
            },
            {
                $lookup: {
                    from: "product_v2", // Tên của collection product
                    localField: "_id", // Khóa chính của bảng category
                    foreignField: "product_type", // Khóa ngoại trong bảng product
                    as: "products", // Tên field kết hợp
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1, // Chỉ lấy các trường cần thiết từ category
                    productCount: { $size: "$products" } // Đếm số lượng sản phẩm trong danh mục
                }
            }
        ]);

        res.status(200).json(categories); // Trả về danh sách danh mục và số lượng sản phẩm
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi tải danh mục và sản phẩm" });
    }
},
  productByCategoryDisable: async (req, res) => {
    try {
        // Sử dụng aggregate để kết hợp danh mục và đếm số lượng sản phẩm trong mỗi danh mục
        const categories = await Categories.aggregate([
            {
                $match: { status: "disable" } 
            },
            {
                $lookup: {
                    from: "product_v2", // Tên của collection product
                    localField: "_id", // Khóa chính của bảng category
                    foreignField: "product_type", // Khóa ngoại trong bảng product
                    as: "products", // Tên field kết hợp
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1, // Chỉ lấy các trường cần thiết từ category
                    productCount: { $size: "$products" } // Đếm số lượng sản phẩm trong danh mục
                }
            }
        ]);

        res.status(200).json(categories); // Trả về danh sách danh mục và số lượng sản phẩm
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi tải danh mục và sản phẩm" });
    }
},


};

module.exports = statisticalController;
