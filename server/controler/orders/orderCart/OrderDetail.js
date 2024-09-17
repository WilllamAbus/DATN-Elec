const OrderDetail = require("../../../model/orders/orderCart/OrderDetails");

const OrderController = {
  getOrderById: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await OrderDetail.findOne({
        order: orderId,
      })
        .populate({
          path: "order", // Populate the entire order object
          populate: [
            {
              path: "payment", // Populate payment within the order
              model: "payment",
            },
            {
              path: "shipping", // Populate shipping within the order
              model: "shipping",
            },
          ],
        })
        .populate({
          path: "items.product", // Populate product details in order items
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
      const userId = req.user?.id; // Lấy ID người dùng từ request

      // Tìm tất cả chi tiết đơn hàng liên quan đến người dùng
      const orderDetails = await OrderDetail.find({ user: userId })
        .populate({
          path: "items.product", // Populate chi tiết sản phẩm
          model: "product_v2",
        })
        .populate("order"); // Populate thông tin đơn hàng

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
  // Lấy tất cả chi tiết đơn hàng
  getAllOrderDetails: async (req, res) => {
    try {
      const orderDetails = await OrderDetail.find()
        .populate({
          path: "items.product", // Populate chi tiết sản phẩm
          model: "product_v2",
        })
        .populate("order"); // Populate thông tin đơn hàng

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
          items: req.body.items, // Cập nhật items bao gồm product, quantity, price, totalItemPrice
        },
        { new: true } // Trả về đối tượng mới sau khi cập nhật
      )
        .populate({
          path: "items.product", // Populate chi tiết sản phẩm
          model: "product_v2",
        })
        .populate("order"); // Populate thông tin đơn hàng

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
      const orderDetailId = req.params.id;

      const deletedOrderDetail = await OrderDetail.findByIdAndDelete(
        orderDetailId
      );

      if (!deletedOrderDetail) {
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
};

module.exports = OrderController;
