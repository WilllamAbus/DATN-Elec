const Order = require("../../../model/orders/orderCart/orders");
const Cart = require("../../../model/orders/cart.model");
const OrderDetail = require("../../../model/orders/orderCart/OrderDetails");
const Payment = require("../../../model/orders/payment.model");
const Inventory = require("../../../model/inventory/inventory.model");
const Interaction = require("../../../model/recommendation/interaction.model");
const Shipping = require("../../../model/orders/shipping.model");
const Voucher = require("../../../model/voucher.model");
const User = require("../../../model/users.model");
const Vnpay = require("../../../model/orders/vnpay.model");
const OrderService = require("../../../services/orders/orderSp");
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
        payment: paymentInfo,
      } = req.body;

      console.log("Yêu cầu Body:", req.body);

      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tìm thấy" });
      }

      const selectedItems = cart.items.filter(
        (item) => item.isSelected === true
      );
      if (selectedItems.length === 0) {
        return res
          .status(400)
          .json({ message: "Chưa có sản phẩm nào được chọn" });
      }

      if (!paymentInfo) {
        return res
          .status(400)
          .json({ message: "Thông tin thanh toán không được cung cấp" });
      }

      // Xử lý thanh toán
      let paymentId = null;
      if (paymentInfo.payment_method === "vnPay") {
        const existingVnpay = await Vnpay.findOne({
          transaction: paymentInfo.order_info,
        });

        if (!existingVnpay) {
          return res
            .status(400)
            .json({ message: "Giao dịch VNPay không tồn tại" });
        }

        const existingPayment = await Payment.findOne({
          order_info: paymentInfo.order_info,
        });

        if (existingPayment) {
          return res
            .status(400)
            .json({ message: "Giao dịch đã tồn tại trong Payment" });
        }

        const newPayment = new Payment({
          amount: paymentInfo?.amount || 0,
          order_info: paymentInfo?.order_info || "null",
          payment_date: paymentInfo?.payment_date || new Date(),
          payment_method: "vnPay",
        });

        await newPayment.save();
        paymentId = newPayment._id;
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
        paymentId = newPayment._id;
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

      // Tạo đơn hàng
      const newOrder = new Order({
        user: userId,
        payment: paymentId || null,
        shipping: newShipping._id,
        voucherIds,
        cartDetails: [],
        formatShipping,
        totalAmount,
        shippingFee,
        totalPriceWithShipping,
        stateOrder: "Chờ xử lý",
      });

      await newOrder.save();
      const orderDetailItems = [];
      for (const item of selectedItems) {
        const productVariant = item.product;
        const inventory = await Inventory.findOne({
          product: productVariant._id,
        });

        if (!inventory) {
          return res
            .status(400)
            .json({ message: "Thông tin tồn kho bị thiếu." });
        }

        orderDetailItems.push({
          product: productVariant._id,
          quantity: item.quantity,
          price: item.price,
          totalItemPrice: item.quantity * item.price,
          inventory: inventory._id,
        });
      }

      const orderDetail = new OrderDetail({
        order: newOrder._id,
        items: orderDetailItems,
        quantity: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
        price: orderDetailItems.reduce((sum, item) => sum + item.price, 0),
        totalItemPrice: orderDetailItems.reduce(
          (sum, item) => sum + item.totalItemPrice,
          0
        ),
      });

      await orderDetail.save();

      newOrder.cartDetails = [orderDetail._id];
      await newOrder.save();

      const newInteraction = new Interaction({
        user: userId,
        OrderCart: newOrder._id,
        type: "purchase",
        productID: null,
        score: 5,
      });

      await newInteraction.save();

      cart.items = cart.items.filter((item) => item.isSelected === false);
      await cart.save();

      const user = await User.findById(userId);

      await sendOrderConfirmationEmail(user.email, {
        recipientName: newShipping.recipientName,
        address: newShipping.address,
        paymentMethod: paymentInfo.payment_method,
        items: orderDetailItems,
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

  getOrders: async (req, res) => {
    const userId = req.user.id;
    try {
      if (!userId) {
        return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
      }

      const orders = await Order.find({ isDeleted: false })
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
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      const orders = await Order.find({ user: userId, isDeleted: false })
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
  cancelOrderAdmin: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
      }
      const { orderId } = req.params;
      const order = await Order.findOne({
        _id: orderId,
        // user: userId,
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

  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { stateOrder } = req.body;

      // Find the order and populate cartDetails
      const order = await Order.findById(orderId).populate({
        path: "cartDetails",
        populate: [
          {
            path: "items.product",
            model: "product_v2",
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
      }

      if (order.stateOrder === "Hoàn tất") {
        return res.status(400).json({
          message:
            "Đơn hàng đã hoàn tất và không thể cập nhật trạng thái khác.",
        });
      }
      if (
        stateOrder === "Hoàn tất" &&
        (order.stateOrder === "Chờ xử lý" || order.stateOrder === "Đã xác nhận")
      ) {
        return res.status(400).json({
          message:
            "Đơn hàng không thể chuyển từ trạng thái 'Chờ xử lý' hoặc 'Đã xác nhận' sang trạng thái 'Hoàn tất'.",
        });
      }
      if (order.stateOrder === "Hủy đơn hàng") {
        return res.status(400).json({
          message: "Đơn hàng đã bị hủy và không thể cập nhật trạng thái khác.",
        });
      }

      if (
        order.stateOrder === "Đang vận chuyển" &&
        (stateOrder === "Chờ xử lý" || stateOrder === "Đã xác nhận")
      ) {
        return res.status(400).json({
          message:
            "Đơn hàng đang vận chuyển không thể chuyển về trạng thái 'Chờ xử lý' hoặc 'Đã xác nhận'.",
        });
      }
      if (
        order.stateOrder === "Chờ xử lý" &&
        stateOrder === "Đang vận chuyển"
      ) {
        return res.status(400).json({
          message:
            "Đơn hàng ở trạng thái 'Chờ xử lý' không thể chuyển sang trạng thái 'Đang vận chuyển'.",
        });
      }
      const originalQuantities = {};

      if (stateOrder === "Đã xác nhận") {
        for (const detail of order.cartDetails) {
          for (const item of detail.items) {
            const productVariant = item.product;

            if (!productVariant) {
              return res
                .status(400)
                .json({ message: "Thông tin sản phẩm bị thiếu." });
            }

            const inventory = await Inventory.findOne({
              product: productVariant._id,
            });

            if (!inventory) {
              return res
                .status(400)
                .json({ message: "Thông tin tồn kho bị thiếu." });
            }

            if (!originalQuantities[productVariant._id]) {
              originalQuantities[productVariant._id] = inventory.quantityShelf;
            }

            if (inventory.quantityShelf < item.quantity) {
              return res.status(400).json({
                message: `Số lượng sản phẩm ${productVariant.product_name} không đủ.`,
              });
            }

            inventory.quantityShelf -= item.quantity;
            await inventory.save();
          }
        }
      }
      if (stateOrder === "Chờ xử lý" && order.stateOrder === "Đã xác nhận") {
        for (const detail of order.cartDetails) {
          for (const item of detail.items) {
            const productVariant = item.product;

            if (!productVariant) {
              return res
                .status(400)
                .json({ message: "Thông tin sản phẩm bị thiếu." });
            }

            const inventory = await Inventory.findOne({
              product: productVariant._id,
            });

            if (!inventory) {
              return res
                .status(400)
                .json({ message: "Thông tin tồn kho bị thiếu." });
            }

            inventory.quantityShelf += item.quantity;
            await inventory.save();
          }
        }
      }

      if (stateOrder === "Hủy đơn hàng" && order.stateOrder === "Đã xác nhận") {
        for (const detail of order.cartDetails) {
          for (const item of detail.items) {
            const productVariant = item.product;

            if (!productVariant) {
              return res
                .status(400)
                .json({ message: "Thông tin sản phẩm bị thiếu." });
            }

            const inventory = await Inventory.findOne({
              product: productVariant._id,
            });

            if (!inventory) {
              return res
                .status(400)
                .json({ message: "Thông tin tồn kho bị thiếu." });
            }

            inventory.quantityShelf += item.quantity;
            await inventory.save();
          }
        }
      }

      order.stateOrder = stateOrder;
      await order.save();

      res.status(200).json({
        message: "Trạng thái đơn hàng đã được cập nhật thành công.",
        order,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      res.status(500).json({
        message: "Lỗi khi cập nhật trạng thái đơn hàng",
        error: error.message || error,
      });
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Không thấy đơn hàng!" });
      }

      // Kiểm tra trạng thái đơn hàng
      if (
        order.stateOrder !== "Hủy đơn hàng" &&
        order.stateOrder !== "Hoàn tất"
      ) {
        return res.status(403).json({
          message:
            "Đơn hàng không thể bị xóa vì trạng thái chưa hủy hoặc hoàn tất",
        });
      }
      const now = new Date();
      order.isDeleted = true;
      order.deletedAt = now;
      await order.save();

      res.status(200).json({ message: "Xóa đơn hàng thành công" });
    } catch (error) {
      console.error("Lỗi xóa đơn hàng:", error);
      res.status(500).json({
        message: "Lỗi xóa đơn hàng",
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

  getOrderLimit: async (req, res) => {
    const { page, search } = req.query;

    try {
      const response = await OrderService.getOrderLimitService(page, search);
      if (response.err) {
        return res.status(400).json({
          success: false,
          err: response.err,
          msg: response.msg || "Lỗi khi lấy đơn hàng",
          status: 400,
        });
      }

      const currentPage = page ? +page : 1;
      const totalPages = Math.ceil(
        response.response.total / (+process.env.LIMIT || 1)
      );

      return res.status(200).json({
        success: true,
        err: 0,
        msg: "OK",
        status: 200,
        data: response.response,
        pagination: {
          currentPage,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      });
    } catch (error) {
      console.error("Error:", error);

      return res.status(500).json({
        success: false,
        err: -1,
        msg: "Lỗi: " + error.message,
        status: 500,
      });
    }
  },
};

module.exports = authController;
