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
const productVariant = require("../../../model/product_v2/productVariant");
const OrderService = require("../../../services/orders/orderSp");
const path = require("path");
const { spawn } = require("child_process");
const {
  sendOrderConfirmationEmail,
} = require("../../../services/email.service");
const authController = {
  createOrder: async (req, res) => {
    try {
      // Check if user is authenticated
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

      // Fetch cart
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tìm thấy" });
      }

      // Filter selected items
      const selectedItems = cart.items.filter(
        (item) => item.isSelected === true
      );
      if (selectedItems.length === 0) {
        return res
          .status(400)
          .json({ message: "Chưa có sản phẩm nào được chọn" });
      }

      // Check payment and shipping info
      if (!paymentInfo) {
        return res
          .status(400)
          .json({ message: "Thông tin thanh toán không được cung cấp" });
      }
      if (!shipping) {
        return res
          .status(400)
          .json({ message: "Thông tin giao hàng không được cung cấp" });
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

      // Create shipping info
      const newShipping = new Shipping({
        recipientName: shipping.recipientName || "Chưa có tên người nhận",
        phoneNumber: shipping.phoneNumber || "Chưa có số điện thoại",
        address: shipping.address || "Chưa có địa chỉ",
        stateShipping: "Xác nhận",
      });
      await newShipping.save();

      // Validate vouchers if provided
      if (voucherIds.length > 0) {
        const vouchers = await Voucher.find({ _id: { $in: voucherIds } });
        if (voucherIds.length !== vouchers.length) {
          return res
            .status(404)
            .json({ message: "Một số voucher không tìm thấy" });
        }
      }

      // Calculate total price with shipping fee
      const totalamount = selectedItems.reduce((sum, item) => {
        return sum + item.totalItemPrice; // Sử dụng totalItemPrice đã có
      }, 0);

      // Calculate shipping fee
      const shippingFee = shipping.shipping || 0;

      // Calculate total price with shipping
      const totalPriceWithShipping = totalamount + shippingFee;

      // Create new order
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

      // Prepare order details
      const orderDetailItems = [];
      for (const item of selectedItems) {
        const selectedVariant = await productVariant
          .findOne({ _id: item.productVariant })
          .populate("product")
          .populate("inventory");

        if (!selectedVariant) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy biến thể sản phẩm" });
        }

        const product = selectedVariant.product;
        const inventory = selectedVariant.inventory?.[0] || null;
        if (!inventory || inventory.quantityShelf < item.quantity) {
          return res
            .status(400)
            .json({ message: "Số lượng trong kho không đủ" });
        }

        orderDetailItems.push({
          product: product._id,
          productVariant: item.productVariant,
          quantity: item.quantity,
          price: item.price,
          totalItemPrice: item.quantity * item.price,
          inventory: inventory._id,
        });
      }

      // Create order detail record
      const orderDetail = new OrderDetail({
        order: newOrder._id,
        items: orderDetailItems,
        totalItemPrice: orderDetailItems.reduce(
          (sum, item) => sum + item.totalItemPrice,
          0
        ),
      });
      await orderDetail.save();

      // Link order details to the order
      newOrder.cartDetails = [orderDetail._id];
      await newOrder.save();

      // Record user interaction
      const newInteraction = new Interaction({
        user: userId,
        OrderCart: newOrder._id,
        type: "purchase",
        productVariants: selectedItems.map((item) => item.productVariant),
        score: 5,
      });
      await newInteraction.save();

      const pythonScriptPath = path.resolve(
        __dirname,
        "../../../../Python Client Server/recommendation_service.py"
      );

      console.log("Python Script Path:", pythonScriptPath);

      const pythonProcess = spawn("python", [
        pythonScriptPath,
        userId.toString(),
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

      // Remove selected items from cart
      cart.items = cart.items.filter((item) => item.isSelected === false);
      await cart.save();

      // Send confirmation email
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
  // createOrder: async (req, res) => {
  //   try {
  //     // Kiểm tra người dùng đã đăng nhập
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
  //       payment: paymentInfo,
  //     } = req.body;

  //     // Fetch cart
  //     const cart = await Cart.findById(cartId);
  //     if (!cart) {
  //       return res.status(404).json({ message: "Giỏ hàng không tìm thấy" });
  //     }

  //     // Filter selected items
  //     const selectedItems = cart.items.filter(
  //       (item) => item.isSelected === true
  //     );
  //     if (selectedItems.length === 0) {
  //       return res
  //         .status(400)
  //         .json({ message: "Chưa có sản phẩm nào được chọn" });
  //     }

  //     // Check payment and shipping info
  //     if (!paymentInfo) {
  //       return res
  //         .status(400)
  //         .json({ message: "Thông tin thanh toán không được cung cấp" });
  //     }
  //     if (!shipping) {
  //       return res
  //         .status(400)
  //         .json({ message: "Thông tin giao hàng không được cung cấp" });
  //     }

  //     // Handle payment for VNPay
  //     let paymentId = null;
  //     if (paymentInfo.payment_method === "vnPay") {
  //       // Xử lý thanh toán VNPay sau khi xác nhận từ VNPay (sẽ xảy ra trong hàm vnpayReturn)
  //       paymentId = null;
  //     }

  //     // Tạo thông tin giao hàng
  //     const newShipping = new Shipping({
  //       recipientName: shipping.recipientName || "Chưa có tên người nhận",
  //       phoneNumber: shipping.phoneNumber || "Chưa có số điện thoại",
  //       address: shipping.address || "Chưa có địa chỉ",
  //       stateShipping: "Chờ xác nhận",
  //     });
  //     await newShipping.save();

  //     // Validate vouchers if provided
  //     if (voucherIds.length > 0) {
  //       const vouchers = await Voucher.find({ _id: { $in: voucherIds } });
  //       if (voucherIds.length !== vouchers.length) {
  //         return res
  //           .status(404)
  //           .json({ message: "Một số voucher không tìm thấy" });
  //       }
  //     }

  //     // Calculate total price with shipping fee
  //     const totalamount = selectedItems.reduce((sum, item) => {
  //       return sum + item.totalItemPrice;
  //     }, 0);

  //     const shippingFee = shipping.shipping || 0;
  //     const totalPriceWithShipping = totalamount + shippingFee;

  //     // Tạo đơn hàng (chưa thanh toán)
  //     const newOrder = new Order({
  //       user: userId,
  //       payment: paymentId || null,
  //       shipping: newShipping._id,
  //       voucherIds,
  //       cartDetails: [],
  //       formatShipping,
  //       totalAmount,
  //       shippingFee,
  //       totalPriceWithShipping,
  //       stateOrder: "Chờ xử lý", // Đợi thanh toán VNPay
  //     });
  //     await newOrder.save();

  //     // Chuẩn bị chi tiết đơn hàng
  //     const orderDetailItems = [];
  //     for (const item of selectedItems) {
  //       const selectedVariant = await productVariant
  //         .findOne({ _id: item.productVariant })
  //         .populate("product")
  //         .populate("inventory");

  //       if (!selectedVariant) {
  //         return res
  //           .status(404)
  //           .json({ message: "Không tìm thấy biến thể sản phẩm" });
  //       }

  //       const product = selectedVariant.product;
  //       const inventory = selectedVariant.inventory?.[0] || null;
  //       if (!inventory || inventory.quantityShelf < item.quantity) {
  //         return res
  //           .status(400)
  //           .json({ message: "Số lượng trong kho không đủ" });
  //       }

  //       orderDetailItems.push({
  //         product: product._id,
  //         productVariant: item.productVariant,
  //         quantity: item.quantity,
  //         price: item.price,
  //         totalItemPrice: item.quantity * item.price,
  //         inventory: inventory._id,
  //       });
  //     }

  //     // Tạo bản ghi chi tiết đơn hàng
  //     const orderDetail = new OrderDetail({
  //       order: newOrder._id,
  //       items: orderDetailItems,
  //       totalItemPrice: orderDetailItems.reduce(
  //         (sum, item) => sum + item.totalItemPrice,
  //         0
  //       ),
  //     });
  //     await orderDetail.save();

  //     // Liên kết chi tiết đơn hàng với đơn hàng
  //     newOrder.cartDetails = [orderDetail._id];
  //     await newOrder.save();

  //     // Lưu tương tác của người dùng
  //     const newInteraction = new Interaction({
  //       user: userId,
  //       OrderCart: newOrder._id,
  //       type: "purchase",
  //       productVariants: selectedItems.map((item) => item.productVariant),
  //       score: 5,
  //     });
  //     await newInteraction.save();

  //     // Xóa sản phẩm đã chọn khỏi giỏ hàng
  //     cart.items = cart.items.filter((item) => item.isSelected === false);
  //     await cart.save();

  //     res.status(201).json({
  //       message: "Đơn hàng đã được tạo thành công, chờ thanh toán",
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

          populate: {
            path: "items.productVariant",
            model: "productVariant",
            populate: [
              { path: "image", model: "ImageVariant" },
              { path: "battery", model: "Battery" },
              { path: "color", model: "Color" },
              { path: "cpu", model: "Cpu" },
              { path: "operatingSystem", model: "OperatingSystem" },
              { path: "ram", model: "Ram" },
              { path: "screen", model: "Screen" },
              { path: "storage", model: "Storage" },
            ],
          },
        })

        .populate("payment")
        .populate("shipping")
        .populate({
          path: "voucherIds",
          model: "Voucher",
        });

      // .populate({
      //   path: "items.productVariant",
      //   model: "productVariant",
      //   populate: [
      //     { path: "image", model: "ImageVariant" },
      //     { path: "battery", model: "Battery" },
      //     { path: "color", model: "Color" },
      //     { path: "cpu", model: "Cpu" },
      //     { path: "operatingSystem", model: "OperatingSystem" },
      //     { path: "ram", model: "Ram" },
      //     { path: "screen", model: "Screen" },
      //     { path: "storage", model: "Storage" },
      //   ],
      // })
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
      const { cancelReason } = req.body;

      const order = await Order.findOne({
        _id: orderId,
        user: userId,
        isDeleted: false,
      }).populate("payment");

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
            "Order cannot be canceled. Only orders with 'Chờ xử lý' or 'Đã xác nhận' status can be canceled.",
        });
      }

      // Kiểm tra phương thức thanh toán
      if (order.payment.payment_method === "Thanh toán khi nhận hàng") {
        // Nếu là "Thanh toán khi nhận hàng", không cần lấy thông tin ngân hàng
        order.stateOrder = "Hủy đơn hàng";
        order.cancelReason = cancelReason;
      } else {
        // Nếu là phương thức thanh toán khác, lấy thông tin ngân hàng
        const user = await User.findById(userId).populate("banks");
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const defaultBank =
          user.banks.find((bank) => bank.isDefault) || user.banks[0];

        if (!defaultBank) {
          return res.status(400).json({
            message: "No bank information found for the user",
          });
        }

        // Cập nhật thông tin ngân hàng
        order.stateOrder = "Hủy đơn hàng";
        order.cancelReason = cancelReason;
        order.refundBank = {
          bankName: defaultBank.name,
          accountNumber: defaultBank.accountNumber,
          accountName: defaultBank.fullName,
        };
      }

      await order.save();

      res.status(200).json({
        message: "Order successfully canceled",
        order,
      });
    } catch (error) {
      console.error("Error canceling order:", error);
      res.status(500).json({
        message: "Error canceling order",
        error: error.message || error,
      });
    }
  },

  // cancelOrder: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const { orderId } = req.params;
  //     const { cancelReason } = req.body;

  //     const order = await Order.findOne({
  //       _id: orderId,
  //       user: userId,
  //       isDeleted: false,
  //     });

  //     if (!order) {
  //       return res
  //         .status(404)
  //         .json({ message: "Order not found or does not belong to this user" });
  //     }

  //     if (
  //       order.stateOrder !== "Chờ xử lý" &&
  //       order.stateOrder !== "Đã xác nhận"
  //     ) {
  //       return res.status(400).json({
  //         message:
  //           "Order cannot be canceled. Only orders with 'Chờ xử lý' or 'Đã xác nhận' status can be canceled.",
  //       });
  //     }

  //     order.stateOrder = "Hủy đơn hàng";
  //     order.cancelReason = cancelReason;
  //     await order.save();

  //     res.status(200).json({ message: "Order successfully canceled", order });
  //   } catch (error) {
  //     console.error("Error canceling order:", error);
  //     res.status(500).json({
  //       message: "Error canceling order",
  //       error: error.message || error,
  //     });
  //   }
  // },
  cancelOrderAdmin: async (req, res) => {
    try {
      const adminId = req.user.id;

      if (!adminId) {
        return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
      }

      const { orderId } = req.params;
      const { cancelReason } = req.body;

      const order = await Order.findOne({
        _id: orderId,
        isDeleted: false,
      })
        .populate("user")
        .populate("payment");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
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

      if (!order.user) {
        return res.status(404).json({ message: "User information not found" });
      }

      // Kiểm tra phương thức thanh toán
      if (order.payment.payment_method === "Thanh toán khi nhận hàng") {
        // Nếu là "Thanh toán khi nhận hàng", không cần lấy thông tin ngân hàng
        order.stateOrder = "Hủy đơn hàng";
        order.cancelReason = cancelReason;
      } else {
        // Nếu là phương thức thanh toán khác, lấy thông tin ngân hàng của người đặt đơn
        const user = await User.findById(order.user._id).populate("banks");
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const defaultBank =
          user.banks.find((bank) => bank.isDefault) || user.banks[0];

        if (!defaultBank) {
          return res.status(400).json({
            message: "No bank information found for the user",
          });
        }

        // Cập nhật thông tin ngân hàng vào đơn hàng
        order.stateOrder = "Hủy đơn hàng";
        order.cancelReason = cancelReason;
        order.refundBank = {
          bankName: defaultBank.name,
          accountNumber: defaultBank.accountNumber,
          accountName: defaultBank.fullName,
        };
      }

      await order.save();

      res.status(200).json({
        message: "Order successfully canceled",
        order,
      });
    } catch (error) {
      console.error("Error canceling order:", error);
      res.status(500).json({
        message: "Error canceling order",
        error: error.message || error,
      });
    }
  },

  // cancelOrderAdmin: async (req, res) => {
  //   try {
  //     const userId = req.user.id;

  //     if (!userId) {
  //       return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
  //     }
  //     const { orderId } = req.params;
  //     const order = await Order.findOne({
  //       _id: orderId,
  //       // user: userId,
  //       isDeleted: false,
  //     });

  //     if (!order) {
  //       return res
  //         .status(404)
  //         .json({ message: "Order not found or does not belong to this user" });
  //     }

  //     if (
  //       order.stateOrder !== "Chờ xử lý" &&
  //       order.stateOrder !== "Đã xác nhận"
  //     ) {
  //       return res.status(400).json({
  //         message:
  //           "Order cannot be canceled. Only orders with 'Chờ xử lý' or 'Xác nhận đơn hàng' status can be canceled.",
  //       });
  //     }

  //     // Cập nhật trạng thái đơn hàng thành 'Cancelorder'
  //     order.stateOrder = "Hủy đơn hàng";
  //     await order.save();

  //     res.status(200).json({ message: "Order successfully canceled", order });
  //   } catch (error) {
  //     console.error("Error canceling order:", error);
  //     res.status(500).json({
  //       message: "Error canceling order",
  //       error: error.message || error,
  //     });
  //   }
  // },
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

  // updateOrderStatus: async (req, res) => {
  //   try {
  //     const { orderId } = req.params;
  //     const { stateOrder } = req.body;

  //     // Find the order and populate cartDetails
  //     const order = await Order.findById(orderId).populate({
  //       path: "cartDetails",
  //       populate: [
  //         {
  //           path: "items.product",
  //           model: "product_v2",
  //         },
  //       ],
  //     });

  //     if (!order) {
  //       return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
  //     }

  //     if (order.stateOrder === "Hoàn tất") {
  //       return res.status(400).json({
  //         message:
  //           "Đơn hàng đã hoàn tất và không thể cập nhật trạng thái khác.",
  //       });
  //     }
  //     if (
  //       stateOrder === "Hoàn tất" &&
  //       (order.stateOrder === "Chờ xử lý" || order.stateOrder === "Đã xác nhận")
  //     ) {
  //       return res.status(400).json({
  //         message:
  //           "Đơn hàng không thể chuyển từ trạng thái 'Chờ xử lý' hoặc 'Đã xác nhận' sang trạng thái 'Hoàn tất'.",
  //       });
  //     }
  //     if (order.stateOrder === "Hủy đơn hàng") {
  //       return res.status(400).json({
  //         message: "Đơn hàng đã bị hủy và không thể cập nhật trạng thái khác.",
  //       });
  //     }

  //     if (
  //       order.stateOrder === "Đang vận chuyển" &&
  //       (stateOrder === "Chờ xử lý" || stateOrder === "Đã xác nhận")
  //     ) {
  //       return res.status(400).json({
  //         message:
  //           "Đơn hàng đang vận chuyển không thể chuyển về trạng thái 'Chờ xử lý' hoặc 'Đã xác nhận'.",
  //       });
  //     }
  //     if (
  //       order.stateOrder === "Chờ xử lý" &&
  //       stateOrder === "Đang vận chuyển"
  //     ) {
  //       return res.status(400).json({
  //         message:
  //           "Đơn hàng ở trạng thái 'Chờ xử lý' không thể chuyển sang trạng thái 'Đang vận chuyển'.",
  //       });
  //     }
  //     const originalQuantities = {};

  //     if (stateOrder === "Đã xác nhận") {
  //       for (const detail of order.cartDetails) {
  //         for (const item of detail.items) {
  //           const productVariant = item.product;

  //           if (!productVariant) {
  //             return res
  //               .status(400)
  //               .json({ message: "Thông tin sản phẩm bị thiếu." });
  //           }

  //           const inventory = await Inventory.findOne({
  //             product_variant: productVariant._id,
  //           });

  //           if (!inventory) {
  //             return res
  //               .status(400)
  //               .json({ message: "Thông tin tồn kho bị thiếu." });
  //           }

  //           if (!originalQuantities[productVariant._id]) {
  //             originalQuantities[productVariant._id] = inventory.quantityShelf;
  //           }

  //           if (inventory.quantityShelf < item.quantity) {
  //             return res.status(400).json({
  //               message: `Số lượng sản phẩm ${productVariant.product_name} không đủ.`,
  //             });
  //           }

  //           inventory.quantityShelf -= item.quantity;
  //           await inventory.save();
  //         }
  //       }
  //     }
  //     if (stateOrder === "Chờ xử lý" && order.stateOrder === "Đã xác nhận") {
  //       for (const detail of order.cartDetails) {
  //         for (const item of detail.items) {
  //           const productVariant = item.product;

  //           if (!productVariant) {
  //             return res
  //               .status(400)
  //               .json({ message: "Thông tin sản phẩm bị thiếu." });
  //           }

  //           const inventory = await Inventory.findOne({
  //             product: productVariant._id,
  //           });

  //           if (!inventory) {
  //             return res
  //               .status(400)
  //               .json({ message: "Thông tin tồn kho bị thiếu." });
  //           }

  //           inventory.quantityShelf += item.quantity;
  //           await inventory.save();
  //         }
  //       }
  //     }

  //     if (stateOrder === "Hủy đơn hàng" && order.stateOrder === "Đã xác nhận") {
  //       for (const detail of order.cartDetails) {
  //         for (const item of detail.items) {
  //           const productVariant = item.product;

  //           if (!productVariant) {
  //             return res
  //               .status(400)
  //               .json({ message: "Thông tin sản phẩm bị thiếu." });
  //           }

  //           const inventory = await Inventory.findOne({
  //             product: productVariant._id,
  //           });

  //           if (!inventory) {
  //             return res
  //               .status(400)
  //               .json({ message: "Thông tin tồn kho bị thiếu." });
  //           }

  //           inventory.quantityShelf += item.quantity;
  //           await inventory.save();
  //         }
  //       }
  //     }

  //     order.stateOrder = stateOrder;
  //     await order.save();

  //     res.status(200).json({
  //       message: "Trạng thái đơn hàng đã được cập nhật thành công.",
  //       order,
  //     });
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
  //     res.status(500).json({
  //       message: "Lỗi khi cập nhật trạng thái đơn hàng",
  //       error: error.message || error,
  //     });
  //   }
  // },

  // Xóa đơn hàng
  // updateOrderStatus: async (req, res) => {
  //   try {
  //     const { orderId } = req.params;
  //     const { stateOrder } = req.body;

  //     const order = await Order.findById(orderId).populate({
  //       path: "cartDetails",
  //       populate: [
  //         {
  //           path: "items.product",
  //           model: "product_v2",
  //         },
  //         {
  //           path: "items.productVariant",
  //           model: "productVariant",
  //         },
  //         {
  //           path: "items.inventory",
  //           model: "Inventory",
  //         },
  //       ],
  //     });

  //     if (!order) {
  //       return res.status(404).json({ message: "Đơn hàng không tìm thấy." });
  //     }

  //     // Ánh xạ trạng thái không hợp lệ
  //     const invalidTransitions = {
  //       "Hoàn tất": ["Chờ xử lý", "Đã xác nhận"],
  //       "Hủy đơn hàng": ["Chờ xử lý", "Đang vận chuyển", "Đã xác nhận"],
  //       "Đang vận chuyển": ["Chờ xử lý", "Đã xác nhận"],
  //     };

  //     if (invalidTransitions[order.stateOrder]?.includes(stateOrder)) {
  //       return res.status(400).json({
  //         message: `Không thể chuyển trạng thái từ '${order.stateOrder}' sang '${stateOrder}'.`,
  //       });
  //     }

  //     // Kiểm tra logic "Hủy đơn hàng" => "Hoàn tiền"
  //     if (stateOrder === "Hoàn tiền" && order.stateOrder === "Hủy đơn hàng") {
  //       if (order.payment.payment_method === "Thanh toán khi nhận hàng") {
  //         return res.status(400).json({
  //           message:
  //             "Không thể chuyển trạng thái thành 'Hoàn tiền' khi phương thức thanh toán là 'Thanh toán khi nhận hàng'.",
  //         });
  //       }
  //     } else if (stateOrder === "Hoàn tiền") {
  //       return res.status(400).json({
  //         message: `Chỉ có thể chuyển trạng thái 'Hủy đơn hàng' sang 'Hoàn tiền'.`,
  //       });
  //     }

  //     // Xử lý tồn kho khi trạng thái thay đổi
  //     if (
  //       stateOrder === "Đang vận chuyển" &&
  //       order.stateOrder === "Đã xác nhận"
  //     ) {
  //       for (const detail of order.cartDetails) {
  //         await updateInventory(detail.items, false);
  //       }
  //     }

  //     if (
  //       ["Chờ xử lý", "Hủy đơn hàng"].includes(stateOrder) &&
  //       order.stateOrder === "Đang vận chuyển"
  //     ) {
  //       for (const detail of order.cartDetails) {
  //         await updateInventory(detail.items, true);
  //       }
  //     }

  //     // Cập nhật trạng thái đơn hàng
  //     order.stateOrder = stateOrder;
  //     await order.save();

  //     res.status(200).json({
  //       message: "Trạng thái đơn hàng đã được cập nhật thành công.",
  //       order,
  //     });
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
  //     res.status(500).json({
  //       message: "Lỗi khi cập nhật trạng thái đơn hàng",
  //       error: error.message || error,
  //     });
  //   }
  // },
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { stateOrder } = req.body;

      // Tìm đơn hàng và lấy chi tiết giỏ hàng
      const order = await Order.findById(orderId).populate({
        path: "cartDetails",
        populate: [
          {
            path: "items.product",
            model: "product_v2",
          },
          {
            path: "items.productVariant",
            model: "productVariant",
            populate: [
              { path: "image", model: "ImageVariant" },
              { path: "battery", model: "Battery" },
              { path: "color", model: "Color" },
              { path: "cpu", model: "Cpu" },
              { path: "operatingSystem", model: "OperatingSystem" },
              { path: "ram", model: "Ram" },
              { path: "screen", model: "Screen" },
              { path: "storage", model: "Storage" },
            ],
          },
          {
            path: "items.inventory",
            model: "Inventory",
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
      }

      // Kiểm tra trạng thái không hợp lệ
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
            "Không thể chuyển từ 'Chờ xử lý' hoặc 'Đã xác nhận' sang 'Hoàn tất'.",
        });
      }

      if (order.stateOrder === "Hủy đơn hàng") {
        if (
          stateOrder === "Hoàn tiền" &&
          order.payment?.payment_method === "Thanh toán khi nhận hàng"
        ) {
          return res.status(400).json({
            message:
              "Không thể cập nhật trạng thái 'Hoàn tiền' cho đơn hàng đã bị hủy và thanh toán bằng phương thức 'Thanh toán khi nhận hàng'.",
          });
        }
      }

      if (
        order.stateOrder === "Đang vận chuyển" &&
        ["Chờ xử lý", "Đã xác nhận"].includes(stateOrder)
      ) {
        return res.status(400).json({
          message:
            "Không thể chuyển từ 'Đang vận chuyển' về 'Chờ xử lý' hoặc 'Đã xác nhận'.",
        });
      }

      // Nếu trạng thái hiện tại là "Đang vận chuyển"
      if (order.stateOrder === "Đang vận chuyển") {
        if (
          stateOrder === "Đã hoàn tiền" &&
          order.payment?.payment_method === "Thanh toán khi nhận hàng"
        ) {
          return res.status(400).json({
            message:
              "Không thể cập nhật trạng thái 'Đã hoàn tiền' cho đơn hàng thanh toán bằng 'Thanh toán khi nhận hàng'.",
          });
        }

        if (stateOrder === "Giao hàng không thành công") {
          // Hoàn lại số lượng tồn kho
          for (const detail of order.cartDetails) {
            for (const item of detail.items) {
              const inventory = item.inventory;
              if (!inventory) {
                return res.status(400).json({
                  message: `Thông tin tồn kho bị thiếu cho sản phẩm ${
                    item.product?.name || "không xác định"
                  }.`,
                });
              }
              inventory.quantityShelf += item.quantity;
              await inventory.save();
            }
          }
        }
      }

      // Quản lý kho cho các trạng thái chuyển đổi khác
      const handleInventoryUpdate = async (items, isRestocking) => {
        for (const item of items) {
          const inventory = item.inventory;

          if (!inventory) {
            return res.status(400).json({
              message: `Thông tin tồn kho bị thiếu cho sản phẩm ${
                item.product?.name || "không xác định"
              }.`,
            });
          }

          if (!isRestocking && inventory.quantityShelf < item.quantity) {
            return res.status(400).json({
              message: `Số lượng tồn kho không đủ cho sản phẩm ${
                item.product?.name || "không xác định"
              }.`,
            });
          }

          inventory.quantityShelf += isRestocking
            ? item.quantity
            : -item.quantity;
          await inventory.save();
        }
      };

      // Trừ kho khi chuyển trạng thái sang "Đang vận chuyển"
      if (
        stateOrder === "Đang vận chuyển" &&
        order.stateOrder === "Đã xác nhận"
      ) {
        for (const detail of order.cartDetails) {
          await handleInventoryUpdate(detail.items, false); // Giảm số lượng tồn kho
        }
      }

      // Hoàn lại kho khi chuyển từ "Đang vận chuyển" về "Chờ xử lý" hoặc "Hủy đơn hàng"
      if (
        ["Chờ xử lý", "Hủy đơn hàng"].includes(stateOrder) &&
        order.stateOrder === "Đang vận chuyển"
      ) {
        for (const detail of order.cartDetails) {
          await handleInventoryUpdate(detail.items, true); // Hoàn lại số lượng tồn kho
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

  // updateOrderStatus: async (req, res) => {
  //   try {
  //     const { orderId } = req.params;
  //     const { stateOrder } = req.body;

  //     // Tìm đơn hàng và lấy chi tiết giỏ hàng, bao gồm cả tồn kho
  //     const order = await Order.findById(orderId).populate({
  //       path: "cartDetails",
  //       populate: [
  //         {
  //           path: "items.product",
  //           model: "product_v2",
  //         },
  //         {
  //           path: "items.productVariant",
  //           model: "productVariant",
  //           populate: [
  //             { path: "image", model: "ImageVariant" },
  //             { path: "battery", model: "Battery" },
  //             { path: "color", model: "Color" },
  //             { path: "cpu", model: "Cpu" },
  //             { path: "operatingSystem", model: "OperatingSystem" },
  //             { path: "ram", model: "Ram" },
  //             { path: "screen", model: "Screen" },
  //             { path: "storage", model: "Storage" },
  //           ],
  //         },
  //         {
  //           path: "items.inventory",
  //           model: "Inventory",
  //         },
  //       ],
  //     });

  //     if (!order) {
  //       return res.status(404).json({ message: "Đơn hàng không tìm thấy" });
  //     }

  //     // Kiểm tra các trạng thái không hợp lệ
  //     if (order.stateOrder === "Hoàn tất") {
  //       return res.status(400).json({
  //         message:
  //           "Đơn hàng đã hoàn tất và không thể cập nhật trạng thái khác.",
  //       });
  //     }

  //     if (
  //       stateOrder === "Hoàn tất" &&
  //       (order.stateOrder === "Chờ xử lý" || order.stateOrder === "Đã xác nhận")
  //     ) {
  //       return res.status(400).json({
  //         message:
  //           "Đơn hàng không thể chuyển từ 'Chờ xử lý' hoặc 'Đã xác nhận' sang 'Hoàn tất'.",
  //       });
  //     }

  //     if (order.stateOrder === "Hủy đơn hàng") {
  //       return res.status(400).json({
  //         message: "Đơn hàng đã bị hủy và không thể cập nhật trạng thái khác.",
  //       });
  //     }

  //     if (
  //       order.stateOrder === "Đang vận chuyển" &&
  //       (stateOrder === "Chờ xử lý" || stateOrder === "Đã xác nhận")
  //     ) {
  //       return res.status(400).json({
  //         message:
  //           "Đơn hàng đang vận chuyển không thể chuyển về 'Chờ xử lý' hoặc 'Đã xác nhận'.",
  //       });
  //     }

  //     if (
  //       order.stateOrder === "Chờ xử lý" &&
  //       stateOrder === "Đang vận chuyển"
  //     ) {
  //       return res.status(400).json({
  //         message:
  //           "Đơn hàng ở 'Chờ xử lý' không thể chuyển sang 'Đang vận chuyển'.",
  //       });
  //     }

  //     // Trừ tồn kho khi trạng thái chuyển sang "Đang vận chuyển"
  //     if (
  //       stateOrder === "Đang vận chuyển" &&
  //       order.stateOrder === "Đã xác nhận"
  //     ) {
  //       for (const detail of order.cartDetails) {
  //         for (const item of detail.items) {
  //           const inventory = item.inventory;

  //           if (!inventory) {
  //             return res
  //               .status(400)
  //               .json({ message: "Thông tin tồn kho bị thiếu." });
  //           }

  //           if (inventory.quantityShelf < item.quantity) {
  //             return res.status(400).json({
  //               message: `Số lượng tồn kho của sản phẩm ${item.product.name} không đủ.`,
  //             });
  //           }

  //           // Giảm số lượng tồn kho khi chuyển sang "Đang vận chuyển"
  //           inventory.quantityShelf -= item.quantity;
  //           await inventory.save();
  //         }
  //       }
  //     }

  //     // Nếu chuyển từ "Đang vận chuyển" về "Chờ xử lý", hoàn lại số lượng tồn kho
  //     if (
  //       stateOrder === "Chờ xử lý" &&
  //       order.stateOrder === "Đang vận chuyển"
  //     ) {
  //       for (const detail of order.cartDetails) {
  //         for (const item of detail.items) {
  //           const inventory = item.inventory;

  //           if (!inventory) {
  //             return res
  //               .status(400)
  //               .json({ message: "Thông tin tồn kho bị thiếu." });
  //           }

  //           // Hoàn lại số lượng tồn kho
  //           inventory.quantityShelf += item.quantity;
  //           await inventory.save();
  //         }
  //       }
  //     }

  //     // Nếu chuyển từ "Đang vận chuyển" sang "Hủy đơn hàng", hoàn lại số lượng tồn kho
  //     if (
  //       stateOrder === "Hủy đơn hàng" &&
  //       order.stateOrder === "Đang vận chuyển"
  //     ) {
  //       for (const detail of order.cartDetails) {
  //         for (const item of detail.items) {
  //           const inventory = item.inventory;

  //           if (!inventory) {
  //             return res
  //               .status(400)
  //               .json({ message: "Thông tin tồn kho bị thiếu." });
  //           }

  //           // Hoàn lại số lượng tồn kho
  //           inventory.quantityShelf += item.quantity;
  //           await inventory.save();
  //         }
  //       }
  //     }

  //     // Cập nhật trạng thái đơn hàng
  //     order.stateOrder = stateOrder;
  //     await order.save();

  //     res.status(200).json({
  //       message: "Trạng thái đơn hàng đã được cập nhật thành công.",
  //       order,
  //     });
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
  //     res.status(500).json({
  //       message: "Lỗi khi cập nhật trạng thái đơn hàng",
  //       error: error.message || error,
  //     });
  //   }
  // },

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
        order.stateOrder !== "Hoàn tất" &&
        order.stateOrder !== "Đã hoàn tiền" &&
        order.stateOrder !== "Giao hàng không thành công"
      ) {
        return res.status(403).json({
          message: "Đơn hàng không thể bị xóa",
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

  // getOrderLimit: async (req, res) => {
  //   const { page, search } = req.query;

  //   try {
  //     const response = await OrderService.getOrderLimitService(page, search);
  //     if (response.err) {
  //       return res.status(400).json({
  //         success: false,
  //         err: response.err,
  //         msg: response.msg || "Lỗi khi lấy đơn hàng",
  //         status: 400,
  //       });
  //     }

  //     const currentPage = page ? +page : 1;
  //     const totalPages = Math.ceil(
  //       response.response.total / (+process.env.LIMIT || 1)
  //     );

  //     return res.status(200).json({
  //       success: true,
  //       err: 0,
  //       msg: "OK",
  //       status: 200,
  //       data: response.response,
  //       pagination: {
  //         currentPage,
  //         totalPages,
  //         hasNextPage: currentPage < totalPages,
  //         hasPrevPage: currentPage > 1,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);

  //     return res.status(500).json({
  //       success: false,
  //       err: -1,
  //       msg: "Lỗi: " + error.message,
  //       status: 500,
  //     });
  //   }
  // },
  getOrderLimit: async (req, res) => {
    const userId = req.user.id;
    const { page, search, stateOrder } = req.query;

    try {
      if (!userId) {
        return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
      }
      const response = await OrderService.getOrderLimitService(
        page,
        search,
        stateOrder
      );
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
