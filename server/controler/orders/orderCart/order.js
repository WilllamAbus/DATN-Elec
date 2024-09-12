const Order = require("../../../model/orders/orderCart/orders");
const Cart = require("../../../model/orders/cart.model");
const OrderDetail = require("../../../model/orders/orderCart/OrderDetails");
const Payment = require("../../../model/orders/payment.model");
const Shipping = require("../../../model/orders/shipping.model");
const Voucher = require("../../../model/voucher.model");
const User = require("../../../model/users.model");
const Vnpay = require("../../../model/orders/vnpay.model");
const {
  sendOrderConfirmationEmail,
} = require("../../../services/email.service");
const authController = {
  createOrder: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Người dùng chưa được xác thực" });
      }

      const {
        cartId,
        voucherIds = [],
        formatShipping,
        totalAmount,
        shipping,
        cartDetails,
        payment: paymentInfo,
      } = req.body;

      console.log("Yêu cầu Body:", req.body);

      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tìm thấy" });
      }

      if (cart.items.length === 0) {
        return res.status(400).json({ message: "Giỏ hàng rỗng" });
      }

      if (!paymentInfo) {
        return res
          .status(400)
          .json({ message: "Thông tin thanh toán không được cung cấp" });
      }

      if (paymentInfo.payment_method === "vnPay") {
        const existingVnpay = await Vnpay.findOne({
          transaction: paymentInfo.order_info,
        });

        if (!existingVnpay) {
          return res
            .status(400)
            .json({ message: "Giao dịch VNPay không tồn tại" });
        }

        // Kiểm tra xem mã giao dịch đã tồn tại trong Payment chưa
        const existingPayment = await Payment.findOne({
          order_info: paymentInfo.order_info,
        });

        if (existingPayment) {
          return res
            .status(400)
            .json({ message: "Giao dịch đã tồn tại trong Payment" });
        }

        // Tạo bản ghi thanh toán mới
        const newPayment = new Payment({
          amount: paymentInfo?.amount || 0,
          order_info: paymentInfo?.order_info || "null",
          payment_date: paymentInfo?.payment_date || new Date(),
          payment_method: "vnPay",
        });

        await newPayment.save();

        // Cập nhật thông tin thanh toán cho đơn hàng
        paymentInfo.payment_id = newPayment._id;
      } else if (paymentInfo.payment_method !== "cash") {
        const existingPayment = await Payment.findOne({
          order_info: paymentInfo.order_info,
        });

        if (existingPayment) {
          return res.status(400).json({ message: "Giao dịch đã tồn tại" });
        }

        const newPayment = new Payment({
          amount: paymentInfo?.amount || 0,
          order_info: paymentInfo?.order_info || "null",
          payment_date: paymentInfo?.payment_date || new Date(),
          payment_method:
            paymentInfo?.payment_method || "Chưa chọn phương thức",
        });

        await newPayment.save();

        paymentInfo.payment_id = newPayment._id;
      }

      if (!shipping) {
        return res
          .status(400)
          .json({ message: "Thông tin giao hàng không được cung cấp" });
      }

      const newShipping = new Shipping({
        recipientName: shipping.recipientName || "Chưa có tên người nhận",
        phoneNumber: shipping.phoneNumber || "Chưa có số điện thoại",
        address: shipping.address || "Chưa có địa chỉ",
        stateShipping: "Xác nhận",
      });

      console.log("newShipping", newShipping);

      await newShipping.save();

      if (voucherIds.length > 0) {
        const vouchers = await Voucher.find({ _id: { $in: voucherIds } });
        if (voucherIds.length !== vouchers.length) {
          return res
            .status(404)
            .json({ message: "Một số voucher không tìm thấy" });
        }
      }

      const shippingFee = shipping?.shipping || 0;
      const totalPriceWithShipping = totalAmount + shippingFee;

      const newOrder = new Order({
        user: userId,
        payment: paymentInfo.payment_id || null,
        shipping: newShipping._id,
        voucherIds,
        cartDetails,
        formatShipping,
        totalAmount,
        shippingFee,
        totalPriceWithShipping,
        stateOrder: "Chờ xử lý",
      });

      await newOrder.save();

      const newOrderDetail = new OrderDetail({
        order: newOrder._id,
        items: cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          totalItemPrice: item.quantity * item.price,
        })),
      });

      await newOrderDetail.save();

      // Xóa các sản phẩm khỏi giỏ hàng sau khi tạo đơn hàng thành công
      cart.items = [];
      await cart.save();

      // Gửi email xác nhận đơn hàng
      const user = await User.findById(userId);

      await sendOrderConfirmationEmail(user.email, {
        recipientName: newShipping.recipientName,
        address: newShipping.address,
        paymentMethod: paymentInfo.payment_method,
        items: newOrderDetail.items,
        totalPriceWithShipping,
      });

      res.status(201).json({
        message: "Đơn hàng đã được tạo thành công",
        order: newOrder,
      });
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      res.status(500).json({
        message: "Lỗi khi tạo đơn hàng",
        error: error.message || error,
      });
    }
  },

  // Lấy danh sách đơn hàng của người dùng
  getOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await Order.find({ user: userId, isDeleted: false })
        .populate("cartDetails.product")
        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
        });

      console.log("Fetched Orders: ", orders);
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        message: "Error fetching orders",
        error: error.message || error,
      });
    }
  },
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.id; // Giả sử req.user chứa thông tin của người dùng hiện tại

      const orders = await Order.find({ user: userId, isDeleted: false })
        .populate("cartDetails.product")
        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
        });

      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "Không có đơn hàng" });
      }

      res.status(200).json({ orders });
    } catch (error) {
      console.error("Error fetching user's orders:", error);
      res.status(500).json({
        message: "Error fetching orders",
        error: error.message || error,
      });
    }
  },
  getPendingOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      // Tìm các đơn hàng có trạng thái là "Chờ xử lý" và isDeleted là false
      const pendingOrders = await Order.find({
        user: userId,
        isDeleted: false,
        stateOrder: "Chờ xử lý",
      })
        .populate("cartDetails.product")
        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
        });

      if (!pendingOrders || pendingOrders.length === 0) {
        return res.status(404).json({ message: "Không có đơn hàng chờ xử lý" });
      }

      res.status(200).json({ orders: pendingOrders });
    } catch (error) {
      console.error("Error fetching user's pending orders:", error);
      res.status(500).json({
        message: "Error fetching pending orders",
        error: error.message || error,
      });
    }
  },
  getConfirmOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      // Tìm các đơn hàng có trạng thái là "xác nhận" và isDeleted là false
      const ConfirmOrders = await Order.find({
        user: userId,
        isDeleted: false,
        stateOrder: "Đã xác nhận",
      })
        .populate("cartDetails.product")
        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
        });

      if (!ConfirmOrders || ConfirmOrders.length === 0) {
        return res
          .status(404)
          .json({ message: "No Confirm orders found for this user" });
      }

      res.status(200).json({ orders: ConfirmOrders });
    } catch (error) {
      console.error("Error fetching user's Confirm orders:", error);
      res.status(500).json({
        message: "Error fetching Confirm orders",
        error: error.message || error,
      });
    }
  },
  getShippingOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      // Tìm các đơn hàng có trạng thái là "xác nhận" và isDeleted là false
      const ShippingOrders = await Order.find({
        user: userId,
        isDeleted: false,
        stateOrder: "Đang vận chuyển",
      })
        .populate("cartDetails.product")
        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
        });

      if (!ShippingOrders || ShippingOrders.length === 0) {
        return res
          .status(404)
          .json({ message: "No Shipping orders found for this user" });
      }

      res.status(200).json({ orders: ShippingOrders });
    } catch (error) {
      console.error("Error fetching user's Shipping orders:", error);
      res.status(500).json({
        message: "Error fetching Shipping orders",
        error: error.message || error,
      });
    }
  },
  getCompletedOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      // Tìm các đơn hàng có trạng thái là "xác nhận" và isDeleted là false
      const CompletedOrders = await Order.find({
        user: userId,
        isDeleted: false,
        stateOrder: "Hoàn tất",
      })
        .populate("cartDetails.product")
        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
        });

      if (!CompletedOrders || CompletedOrders.length === 0) {
        return res
          .status(404)
          .json({ message: "No Shipping orders found for this user" });
      }

      res.status(200).json({ orders: CompletedOrders });
    } catch (error) {
      console.error("Error fetching user's Shipping orders:", error);
      res.status(500).json({
        message: "Error fetching Shipping orders",
        error: error.message || error,
      });
    }
  },
  getCancelOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      // Tìm các đơn hàng có trạng thái là "xác nhận" và isDeleted là false
      const CancelOrders = await Order.find({
        user: userId,
        isDeleted: false,
        stateOrder: "Hủy đơn hàng",
      })
        .populate("cartDetails.product")
        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
        });

      if (!CancelOrders || CancelOrders.length === 0) {
        return res
          .status(404)
          .json({ message: "No Shipping orders found for this user" });
      }

      res.status(200).json({ orders: CancelOrders });
    } catch (error) {
      console.error("Error fetching user's Shipping orders:", error);
      res.status(500).json({
        message: "Error fetching Shipping orders",
        error: error.message || error,
      });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const userId = req.user.id;
      const { orderId } = req.params;
      const order = await Order.findOne({
        _id: orderId,
        user: userId,
        isDeleted: false,
      });

      if (!order) {
        return res
          .status(404)
          .json({ message: "Order not found or does not belong to this user" });
      }

      if (
        order.stateOrder !== "Chờ xử lý" &&
        order.stateOrder !== "Đã xác nhận"
      ) {
        return res.status(400).json({
          message:
            "Order cannot be canceled. Only orders with 'Chờ xử lý' or 'Xác nhận đơn hàng' status can be canceled.",
        });
      }

      // Cập nhật trạng thái đơn hàng thành 'Cancelorder'
      order.stateOrder = "Hủy đơn hàng";
      await order.save();

      res.status(200).json({ message: "Order successfully canceled", order });
    } catch (error) {
      console.error("Error canceling order:", error);
      res.status(500).json({
        message: "Error canceling order",
        error: error.message || error,
      });
    }
  },
  // Lấy chi tiết đơn hàng
  getOrderById: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findOne({ _id: orderId, isDeleted: false })
        .populate("cartDetails.product")
        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
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

  // Cập nhật trạng thái đơn hàng
  // updateOrderStatus: async (req, res) => {
  //   try {
  //     const { orderId } = req.params;
  //     const { stateOrder } = req.body;

  //     const order = await Order.findById(orderId).populate(
  //       "cartDetails.product"
  //     );
  //     if (!order) return res.status(404).json({ message: "Order not found" });

  //     if (stateOrder === "Đã xác nhận") {
  //       for (const item of order.cartDetails) {
  //         const product = item.product;
  //         if (product.product_quantity < item.quantity) {
  //           return res.status(400).json({
  //             message: `Số lượng sản phẩm ${product.product_name} không đủ`,
  //           });
  //         }
  //         product.product_quantity -= item.quantity;
  //         await product.save();
  //       }
  //     }

  //     order.stateOrder = stateOrder;
  //     await order.save();

  //     res.status(200).json({
  //       message: "Order status updated successfully",
  //       order,
  //     });
  //   } catch (error) {
  //     console.error("Error updating order status:", error);
  //     res.status(500).json({
  //       message: "Error updating order status",
  //       error: error.message || error,
  //     });
  //   }
  // },
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { stateOrder } = req.body;

      const order = await Order.findById(orderId).populate(
        "cartDetails.product"
      );
      if (!order) return res.status(404).json({ message: "Order not found" });

      // Nếu trạng thái mới là "Đã xác nhận", kiểm tra và trừ số lượng sản phẩm
      if (stateOrder === "Đã xác nhận") {
        for (const item of order.cartDetails) {
          const product = item.product;
          if (product.product_quantity < item.quantity) {
            return res.status(400).json({
              message: `Số lượng sản phẩm ${product.product_name} không đủ`,
            });
          }
          product.product_quantity -= item.quantity;
          await product.save();
        }
      }

      // Nếu trạng thái mới là "Hủy đơn hàng" và trạng thái hiện tại là "Đã xác nhận", cộng lại số lượng sản phẩm
      if (stateOrder === "Hủy đơn hàng" && order.stateOrder === "Đã xác nhận") {
        for (const item of order.cartDetails) {
          const product = item.product;
          product.product_quantity += item.quantity;
          await product.save();
        }
      }

      // Cập nhật trạng thái đơn hàng
      order.stateOrder = stateOrder;
      await order.save();

      res.status(200).json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        message: "Error updating order status",
        error: error.message || error,
      });
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);

      if (!order) return res.status(404).json({ message: "Order not found" });
      order.isDeleted = true;
      await order.save();

      res
        .status(200)
        .json({ message: "Order deleted successfully (soft delete)" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({
        message: "Error deleting order",
        error: error.message || error,
      });
    }
  },
  restoreOrder: async (req, res) => {
    try {
      const { orderId } = req.params;

      // Tìm và cập nhật đơn hàng để khôi phục (isDeleted: false)
      const order = await Order.findByIdAndUpdate(
        orderId,
        { isDeleted: false },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({
        message: "Order restored successfully",
        order,
      });
    } catch (error) {
      console.error("Error restoring order:", error);
      res.status(500).json({
        message: "Error restoring order",
        error: error.message || error,
      });
    }
  },
};

module.exports = authController;
