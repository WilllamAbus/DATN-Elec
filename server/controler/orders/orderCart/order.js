const Order = require("../../../model/orders/orderCart/orders");
const Cart = require("../../../model/orders/cart.model");
const OrderDetail = require("../../../model/orders/orderCart/OrderDetails");
const Payment = require("../../../model/orders/payment.model");
const Product = require("../../../model/product_v2");

const Shipping = require("../../../model/orders/shipping.model");
const Voucher = require("../../../model/voucher.model");
const User = require("../../../model/users.model");
const Vnpay = require("../../../model/orders/vnpay.model");
const {
  sendOrderConfirmationEmail,
} = require("../../../services/email.service");
const authController = {
  // createOrder: async (req, res) => {
  //   try {
  //     const userId = req.user?.id;
  //     if (!userId) {
  //       return res
  //         .status(401)
  //         .json({ message: "Người dùng chưa được xác thực" });
  //     }

  //     const {
  //       cartId,
  //       voucherIds = [],
  //       formatShipping,
  //       totalAmount,
  //       shipping,
  //       cartDetails,
  //       payment: paymentInfo,
  //     } = req.body;

  //     console.log("Yêu cầu Body:", req.body);

  //     const cart = await Cart.findById(cartId);
  //     if (!cart) {
  //       return res.status(404).json({ message: "Giỏ hàng không tìm thấy" });
  //     }

  //     if (cart.items.length === 0) {
  //       return res.status(400).json({ message: "Giỏ hàng rỗng" });
  //     }

  //     if (!paymentInfo) {
  //       return res
  //         .status(400)
  //         .json({ message: "Thông tin thanh toán không được cung cấp" });
  //     }

  //     if (paymentInfo.payment_method === "vnPay") {
  //       const existingVnpay = await Vnpay.findOne({
  //         transaction: paymentInfo.order_info,
  //       });

  //       if (!existingVnpay) {
  //         return res
  //           .status(400)
  //           .json({ message: "Giao dịch VNPay không tồn tại" });
  //       }

  //       // Kiểm tra xem mã giao dịch đã tồn tại trong Payment chưa
  //       const existingPayment = await Payment.findOne({
  //         order_info: paymentInfo.order_info,
  //       });

  //       if (existingPayment) {
  //         return res
  //           .status(400)
  //           .json({ message: "Giao dịch đã tồn tại trong Payment" });
  //       }

  //       // Tạo bản ghi thanh toán mới
  //       const newPayment = new Payment({
  //         amount: paymentInfo?.amount || 0,
  //         order_info: paymentInfo?.order_info || "null",
  //         payment_date: paymentInfo?.payment_date || new Date(),
  //         payment_method: "vnPay",
  //       });

  //       await newPayment.save();

  //       // Cập nhật thông tin thanh toán cho đơn hàng
  //       paymentInfo.payment_id = newPayment._id;
  //     } else if (paymentInfo.payment_method !== "cash") {
  //       const existingPayment = await Payment.findOne({
  //         order_info: paymentInfo.order_info,
  //       });

  //       if (existingPayment) {
  //         return res.status(400).json({ message: "Giao dịch đã tồn tại" });
  //       }

  //       const newPayment = new Payment({
  //         amount: paymentInfo?.amount || 0,
  //         order_info: paymentInfo?.order_info || "null",
  //         payment_date: paymentInfo?.payment_date || new Date(),
  //         payment_method:
  //           paymentInfo?.payment_method || "Chưa chọn phương thức",
  //       });

  //       await newPayment.save();

  //       paymentInfo.payment_id = newPayment._id;
  //     }

  //     if (!shipping) {
  //       return res
  //         .status(400)
  //         .json({ message: "Thông tin giao hàng không được cung cấp" });
  //     }

  //     const newShipping = new Shipping({
  //       recipientName: shipping.recipientName || "Chưa có tên người nhận",
  //       phoneNumber: shipping.phoneNumber || "Chưa có số điện thoại",
  //       address: shipping.address || "Chưa có địa chỉ",
  //       stateShipping: "Xác nhận",
  //     });

  //     console.log("newShipping", newShipping);

  //     await newShipping.save();

  //     if (voucherIds.length > 0) {
  //       const vouchers = await Voucher.find({ _id: { $in: voucherIds } });
  //       if (voucherIds.length !== vouchers.length) {
  //         return res
  //           .status(404)
  //           .json({ message: "Một số voucher không tìm thấy" });
  //       }
  //     }

  //     const shippingFee = shipping?.shipping || 0;
  //     const totalPriceWithShipping = totalAmount + shippingFee;

  //     const newOrder = new Order({
  //       user: userId,
  //       payment: paymentInfo.payment_id || null,
  //       shipping: newShipping._id,
  //       voucherIds,
  //       cartDetails,
  //       formatShipping,
  //       totalAmount,
  //       shippingFee,
  //       totalPriceWithShipping,
  //       stateOrder: "Chờ xử lý",
  //     });

  //     await newOrder.save();

  //     const newOrderDetail = new OrderDetail({
  //       order: newOrder._id,
  //       items: cart.items.map((item) => ({
  //         product: item.product,
  //         quantity: item.quantity,
  //         price: item.price,
  //         totalItemPrice: item.quantity * item.price,
  //       })),
  //     });

  //     await newOrderDetail.save();

  //     // Xóa các sản phẩm khỏi giỏ hàng sau khi tạo đơn hàng thành công
  //     cart.items = [];
  //     await cart.save();

  //     // Gửi email xác nhận đơn hàng
  //     const user = await User.findById(userId);

  //     await sendOrderConfirmationEmail(user.email, {
  //       recipientName: newShipping.recipientName,
  //       address: newShipping.address,
  //       paymentMethod: paymentInfo.payment_method,
  //       items: newOrderDetail.items,
  //       totalPriceWithShipping,
  //     });

  //     res.status(201).json({
  //       message: "Đơn hàng đã được tạo thành công",
  //       order: newOrder,
  //     });
  //   } catch (error) {
  //     console.error("Lỗi khi tạo đơn hàng:", error);
  //     res.status(500).json({
  //       message: "Lỗi khi tạo đơn hàng",
  //       error: error.message || error,
  //     });
  //   }
  // },

  // Lấy danh sách đơn hàng của người dùng
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

      if (cart.items.length === 0) {
        return res.status(400).json({ message: "Giỏ hàng rỗng" });
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
        cartDetails: [], // Sẽ được cập nhật sau
        formatShipping,
        totalAmount,
        shippingFee,
        totalPriceWithShipping,
        stateOrder: "Chờ xử lý",
      });

      await newOrder.save();

      // Tạo chi tiết đơn hàng cho từng sản phẩm trong giỏ hàng
      const orderDetailItems = cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        totalItemPrice: item.quantity * item.price,
      }));

      const orderDetail = new OrderDetail({
        order: newOrder._id,
        items: orderDetailItems,
        quantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        price: orderDetailItems.reduce((sum, item) => sum + item.price, 0),
        totalItemPrice: orderDetailItems.reduce(
          (sum, item) => sum + item.totalItemPrice,
          0
        ),
      });

      await orderDetail.save();

      // Cập nhật đơn hàng với chi tiết đơn hàng
      newOrder.cartDetails = [orderDetail._id];
      await newOrder.save();

      // Xóa giỏ hàng
      cart.items = [];
      await cart.save();

      // Gửi email xác nhận đơn hàng
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
      // Tìm tất cả đơn hàng, không cần kiểm tra user
      const orders = await Order.find({ isDeleted: false })
        .populate({
          path: "cartDetails",
          populate: {
            path: "items.product",
            model: "product_v2",
          },
        })
        .populate("payment") // Populate thông tin thanh toán
        .populate("shipping") // Populate thông tin giao hàng
        .populate({
          path: "voucherIds",
          model: "Voucher", // Populate chi tiết voucher
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
      const userId = req.user.id; // Giả sử req.user chứa thông tin của người dùng hiện tại

      const orders = await Order.find({ user: userId, isDeleted: false })
        .populate({
          path: "cartDetails",
          populate: {
            path: "items.product",
            model: "product_v2",
          },
        })
        // .populate("cartDetails")
        .populate("payment") // Populate thông tin thanh toán
        .populate("shipping") // Populate thông tin giao hàng
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
        .populate({
          path: "cartDetails",
          populate: {
            path: "items.product",
            model: "product_v2",
          },
        })
        // .populate("cartDetails")
        .populate("payment") // Populate thông tin thanh toán
        .populate("shipping") // Populate thông tin giao hàng
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
        .populate({
          path: "cartDetails",
          populate: {
            path: "items.product",
            model: "product_v2",
          },
        })
        // .populate("cartDetails")
        .populate("payment") // Populate thông tin thanh toán
        .populate("shipping") // Populate thông tin giao hàng
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
        .populate({
          path: "cartDetails",
          populate: {
            path: "items.product",
            model: "product_v2",
          },
        })
        // .populate("cartDetails")
        .populate("payment") // Populate thông tin thanh toán
        .populate("shipping") // Populate thông tin giao hàng
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
        .populate({
          path: "cartDetails",
          populate: {
            path: "items.product",
            model: "product_v2",
          },
        })
        // .populate("cartDetails")
        .populate("payment") // Populate thông tin thanh toán
        .populate("shipping") // Populate thông tin giao hàng
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
      const CancelOrders = await Order.find({
        user: userId,
        isDeleted: false,
        stateOrder: "Hủy đơn hàng",
      })
        .populate({
          path: "cartDetails",
          populate: {
            path: "items.product",
            model: "product_v2",
          },
        })
        // .populate("cartDetails")
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
        // .populate("cartDetails")
        .populate("payment") // Populate thông tin thanh toán
        .populate("shipping") // Populate thông tin giao hàng
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
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { stateOrder } = req.body;

      // Tìm đơn hàng và populate chi tiết đơn hàng
      const order = await Order.findById(orderId).populate({
        path: "cartDetails",
        populate: {
          path: "items.product",
          model: "product_v2",
        },
      });

      if (!order)
        return res.status(404).json({ message: "Đơn hàng không tìm thấy" });

      // Kiểm tra trạng thái đơn hàng hiện tại
      if (order.stateOrder === "Hủy đơn hàng") {
        return res.status(400).json({
          message: "Đơn hàng đã bị hủy và không thể cập nhật trạng thái khác.",
        });
      }

      // Lưu trữ số lượng sản phẩm gốc để rollback nếu cần
      const originalQuantities = {};

      if (stateOrder === "Đã xác nhận") {
        for (const detail of order.cartDetails) {
          for (const item of detail.items) {
            const product = item.product;

            if (!product) {
              return res
                .status(400)
                .json({ message: "Thông tin sản phẩm bị thiếu." });
            }

            // Lưu trữ số lượng sản phẩm gốc để rollback nếu cần
            if (!originalQuantities[product._id]) {
              originalQuantities[product._id] = product.product_quantity;
            }

            if (product.product_quantity < item.quantity) {
              return res.status(400).json({
                message: `Số lượng sản phẩm ${product.product_name} không đủ.`,
              });
            }

            // Cập nhật số lượng sản phẩm
            product.product_quantity -= item.quantity;
            await product.save();
          }
        }
      }

      if (stateOrder === "Hủy đơn hàng" && order.stateOrder === "Đã xác nhận") {
        for (const detail of order.cartDetails) {
          for (const item of detail.items) {
            const product = item.product;

            if (!product) {
              return res
                .status(400)
                .json({ message: "Thông tin sản phẩm bị thiếu." });
            }

            // Kiểm tra nếu số lượng sản phẩm đã được theo dõi
            if (originalQuantities[product._id] !== undefined) {
              product.product_quantity =
                originalQuantities[product._id] + item.quantity;
            } else {
              product.product_quantity += item.quantity;
            }
            await product.save();
          }
        }
      }

      // Cập nhật trạng thái đơn hàng
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
