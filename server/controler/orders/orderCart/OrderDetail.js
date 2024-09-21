const OrderDetail = require("../../../model/orders/orderCart/OrderDetails");
const Order = require("../../../model/orders/orderCart/orders");
const OrderController = {
  getOrderById: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await OrderDetail.findOne({
        order: orderId,
      })
        .populate({
          path: "order",
          populate: [
            {
              path: "payment",
              model: "payment",
            },
            {
              path: "shipping",
              model: "shipping",
            },
          ],
        })
        .populate({
          path: "items.product",
          model: "product_v2",
        });

      if (!order) return res.status(404).json({ message: "Order not found" });

      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({
        message: "Error fetching order",
        error: error.message || error,
      });
    }
  },

  getUserOrders: async (req, res) => {
    try {
      const userId = req.user?.id;

      const orderDetails = await OrderDetail.find({ user: userId })
        .populate({
          path: "items.product",
          model: "product_v2",
        })
        .populate("order");

      if (!orderDetails || orderDetails.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có chi tiết đơn hàng cho người dùng này" });
      }

      res.status(200).json(orderDetails);
    } catch (error) {
      console.error("Lỗi khi lấy tất cả chi tiết đơn hàng:", error);
      res.status(500).json({
        message: "Lỗi khi lấy tất cả chi tiết đơn hàng",
        error: error.message || error,
      });
    }
  },

  getAllOrderDetails: async (req, res) => {
    try {
      const orderDetails = await OrderDetail.find()
        .populate({
          path: "items.product",
          model: "product_v2",
        })
        .populate("order");

      if (!orderDetails || orderDetails.length === 0) {
        return res.status(404).json({ message: "Không có chi tiết đơn hàng" });
      }

      res.status(200).json(orderDetails);
    } catch (error) {
      console.error("Lỗi khi lấy tất cả chi tiết đơn hàng:", error);
      res.status(500).json({
        message: "Lỗi khi lấy tất cả chi tiết đơn hàng",
        error: error.message || error,
      });
    }
  },

  // Cập nhật chi tiết đơn hàng theo ID
  updateOrderDetailById: async (req, res) => {
    try {
      const orderDetailId = req.params.id;

      const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(
        orderDetailId,
        {
          order: req.body.order,
          items: req.body.items,
        },
        { new: true }
      )
        .populate({
          path: "items.product",
          model: "product_v2",
        })
        .populate("order");

      if (!updatedOrderDetail) {
        return res
          .status(404)
          .json({ message: "Chi tiết đơn hàng không tìm thấy" });
      }

      res.status(200).json(updatedOrderDetail);
    } catch (error) {
      console.error("Lỗi khi cập nhật chi tiết đơn hàng:", error);
      res.status(500).json({
        message: "Lỗi khi cập nhật chi tiết đơn hàng",
        error: error.message || error,
      });
    }
  },

  // Xóa chi tiết đơn hàng theo ID
  deleteOrderDetailById: async (req, res) => {
    try {
      const OrderId = req.params.id;

      const deletedOrder = await Order.findByIdAndDelete(OrderId);

      if (!deletedOrder) {
        return res
          .status(404)
          .json({ message: "Chi tiết đơn hàng không tìm thấy" });
      }

      res
        .status(200)
        .json({ message: "Chi tiết đơn hàng đã được xóa thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa chi tiết đơn hàng:", error);
      res.status(500).json({
        message: "Lỗi khi xóa chi tiết đơn hàng",
        error: error.message || error,
      });
    }
  },
  getSoftdeleteOrder: async (req, res) => {
    const userId = req.user.id;
    try {
      if (!userId) {
        return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
      }

      const orders = await Order.find({ isDeleted: true })
        .populate({
          path: "cartDetails",
          populate: {
            path: "items.product",
            model: "product_v2",
          },
        })
        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
        });

      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "Không có đơn hàng nào" });
      }

      res.status(200).json({ orders });
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({
        message: "Lỗi khi lấy đơn hàng",
        error: error.message || error,
      });
    }
  },
};

module.exports = OrderController;
