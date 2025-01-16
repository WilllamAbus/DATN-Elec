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
const AuctionWinner = require("../../../model/productAuction/auctionWinner");
const productAuction = require("../../../model/productAuction/productAuction");
const OrderService = require("../../../services/orders/orderSp");
const path = require("path");
const { spawn } = require("child_process");
const { getIO } = require("../../../services/skserver/socketServer");
const {
  sendOrderConfirmationEmail,
  sendOrderAuctionConfirmationEmail,
  sendEmail,
} = require("../../../services/email.service");
const puppeteer = require('puppeteer');
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
        // Kiểm tra giao dịch VNPay
        const existingVnpay = await Vnpay.findOne({
          transaction: paymentInfo.order_info,
        });

        if (!existingVnpay) {
          return res
            .status(400)
            .json({ message: "Giao dịch VNPay không tồn tại" });
        }

        // Kiểm tra nếu thanh toán đã tồn tại
        const existingPayment = await Payment.findOne({
          order_info: paymentInfo.order_info,
          payment_method: "vnPay", // Kiểm tra phương thức thanh toán
        });

        if (existingPayment) {
          return res
            .status(400)
            .json({ message: "Giao dịch VNPay đã tồn tại" });
        }

        const newPayment = new Payment({
          amount: paymentInfo?.amount || 0,
          order_info: paymentInfo?.order_info || "null",
          payment_date: paymentInfo?.payment_date || new Date(),
          payment_method: "vnPay",
        });

        await newPayment.save();
        paymentId = newPayment._id;
      } else if (paymentInfo.payment_method === "Thanh toán khi nhận hàng") {
        // Lưu giao dịch với phương thức thanh toán "cash"
        const newPayment = new Payment({
          amount: paymentInfo?.amount || 0,
          order_info: paymentInfo?.order_info || "null",
          payment_date: paymentInfo?.payment_date || new Date(),
          payment_method: "Thanh toán khi nhận hàng",
        });

        await newPayment.save();
        paymentId = newPayment._id;
      } else {
        // Kiểm tra nếu thanh toán không phải VNPay hoặc cash
        const existingPayment = await Payment.findOne({
          order_info: paymentInfo.order_info,
          payment_method: paymentInfo.payment_method, // Kiểm tra theo phương thức thanh toán
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
            .json({ message: "Số lượng trong kho không đủ!" });
        }

        orderDetailItems.push({
          product: product._id,
          variantName: selectedVariant.variant_name || "Mặc định", // Lấy tên biến thể
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

  createOrderAuction: async (req, res) => {
    try {
      // Xác thực người dùng
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

      // Kiểm tra giỏ hàng
      const cart = await Cart.findById(cartId).populate([
        {
          path: "itemAuction.auctionPricingRange",
          select: "product_randBib status",
        },
        {
          path: "itemAuction.auctionWinner",
          select: "auctionStatus product_randBib",
        },
      ]);

      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tìm thấy" });
      }

      const selectedItems = cart.itemAuction;

      if (!selectedItems || selectedItems.length === 0) {
        return res
          .status(400)
          .json({ message: "Không có sản phẩm đấu giá trong giỏ hàng" });
      }

      for (const item of selectedItems) {
        const auctionPricingRange = item.auctionPricingRange;
        const auctionWinner = item.auctionWinner;

        if (auctionPricingRange) {
          auctionPricingRange.status = "paid";
          await auctionPricingRange.save();
        }

        if (auctionWinner) {
          auctionWinner.auctionStatus = "paid";
          auctionWinner.paymentStatus = "paid";
          await auctionWinner.populate({
            path: "product_randBib",
            select: "slug",
          });
          await auctionWinner.save();
        }
      }

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
          payment_method: "vnPay",
        });

        if (existingPayment) {
          return res
            .status(400)
            .json({ message: "Giao dịch VNPay đã tồn tại" });
        }

        const newPayment = new Payment({
          amount: paymentInfo?.amount || 0,
          order_info: paymentInfo?.order_info || "null",
          payment_date: paymentInfo?.payment_date || new Date(),
          payment_method: "vnPay",
        });

        await newPayment.save();
        paymentId = newPayment._id;
      } else if (paymentInfo.payment_method === "Thanh toán khi nhận hàng") {
        const newPayment = new Payment({
          amount: paymentInfo?.amount || 0,
          order_info: paymentInfo?.order_info || "null",
          payment_date: paymentInfo?.payment_date || new Date(),
          payment_method: "Thanh toán khi nhận hàng",
        });

        await newPayment.save();
        paymentId = newPayment._id;
      } else {
        const existingPayment = await Payment.findOne({
          order_info: paymentInfo.order_info,
          payment_method: paymentInfo.payment_method,
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

      const newShipping = new Shipping({
        recipientName: shipping.recipientName || "Chưa có tên người nhận",
        phoneNumber: shipping.phoneNumber || "Chưa có số điện thoại",
        address: shipping.address || "Chưa có địa chỉ",
        stateShipping: "Xác nhận",
      });
      await newShipping.save();

      const totalamount = selectedItems.reduce(
        (sum, item) => sum + item.totalItemPrice,
        0
      );
      const shippingFee = shipping.shipping || 0;
      const totalPriceWithShipping = totalamount + shippingFee;

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
        const auctionPricingRange = item.auctionPricingRange;

        const inventory = await Inventory.findOne({
          productAuction: item.productAuction,
        });
        if (!inventory) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy kho hàng cho sản phẩm đấu giá" });
        }

        if (inventory.quantityShelf < item.quantity) {
          return res.status(400).json({
            message: `Số lượng sản phẩm không đủ. Sản phẩm: ${item.productAuction}, số lượng còn lại: ${inventory.quantityShelf}`,
          });
        }
        if (
          !item.auctionPricingRange ||
          !item.auctionPricingRange.product_randBib
        ) {
          return res.status(400).json({
            message: `Dữ liệu sản phẩm bị thiếu thông tin: ${JSON.stringify(
              item
            )}`,
          });
        }
        await auctionPricingRange.populate("product_randBib");
        const productName = auctionPricingRange.product_randBib?.product_name;
        orderDetailItems.push({
          product_randBib: item.auctionPricingRange.product_randBib,
          productName: productName,
          quantity: item.quantity,
          price: item.price,
          totalItemPrice: item.totalItemPrice,
          inventory: inventory,
        });
      }
      const orderDetail = new OrderDetail({
        order: newOrder._id,
        itemAuction: orderDetailItems,
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
        auctionItems: selectedItems.map((item) => item.auctionWinner),
        score: 5,
      });
      await newInteraction.save();
      cart.itemAuction = cart.itemAuction.filter((item) => {
        return !selectedItems.some(
          (selectedItem) => selectedItem._id.toString() === item._id.toString()
        );
      });
      await cart.save();

      for (const item of selectedItems) {
        if (
          item.auctionPricingRange &&
          item.auctionPricingRange.product_randBib
        ) {
          const productRandBibId = item.auctionPricingRange.product_randBib;

          await productAuction.findByIdAndUpdate(
            productRandBibId,
            { status: "disable" },
            { new: true }
          );
        }
      }
      const user = await User.findById(userId);
      try {
        await sendOrderAuctionConfirmationEmail(user.email, {
          recipientName: newShipping.recipientName,
          address: newShipping.address,
          paymentMethod: paymentInfo.payment_method,
          itemAuction: orderDetailItems,
          totalPriceWithShipping,
        });
      } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        return res
          .status(500)
          .json({ message: "Gửi email thất bại", error: error.message });
      }

      const io = getIO();
      for (const item of selectedItems) {
        const auctionWinner = item.auctionWinner;
        await auctionWinner.populate({
          path: "product_randBib",
          select: "slug",
        });
        const slug = auctionWinner.product_randBib.slug;

        console.log(`Slug: ${slug}`);

        io.emit("auctionPaid", {
          auctionWinnerId: auctionWinner._id,
          userId: userId,
          userMessage: user?.message,
          userWarning: user?.warning,
          status: auctionWinner.status,
          auctionStatus: auctionWinner.auctionStatus,
          slug: slug,
        });
      }

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
    const { page, search, stateOrder } = req.query;
    const userId = req.user.id;

    try {
      const response = await OrderService.getUserOrderService(
        userId,
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

  // cancelOrder: async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const { orderId } = req.params;
  //     const { cancelReason } = req.body;

  //     const order = await Order.findOne({
  //       _id: orderId,
  //       user: userId,
  //       isDeleted: false,
  //     })
  //       .populate({
  //         path: "cartDetails",
  //         populate: [
  //           {
  //             path: "items.product",
  //             model: "product_v2",
  //           },
  //           {
  //             path: "items.productVariant",
  //             model: "productVariant",
  //           },
  //           {
  //             path: "items.inventory",
  //             model: "Inventory",
  //           },
  //           {
  //             path: "itemAuction.product_randBib",
  //             model: "productAuction",
  //           },
  //           {
  //             path: "itemAuction.inventory",
  //             model: "Inventory",
  //           },
  //         ],
  //       })
  //       .populate("payment");

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

  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     // Kiểm tra nếu đơn hàng có item đấu giá
  //     const hasAuctionItems = order.cartDetails.some(
  //       (detail) => detail.itemAuction && detail.itemAuction.length > 0
  //     );

  //     // Chỉ tăng cảnh báo nếu có sản phẩm đấu giá
  //     if (hasAuctionItems) {
  //       user.warning += 1;

  //       // Nếu số lần hủy vượt quá 3 lần, thay đổi trạng thái
  //       if (user.warning > 3) {
  //         user.statusAuction = "disable";
  //         user.noteWarning =
  //           "Đã hủy đơn hàng đấu giá quá số lần quy định, vui lòng liên hệ CSKH để được hỗ trợ.";
  //       }

  //       await user.save();
  //     }

  //     // Cập nhật trạng thái đơn hàng
  //     order.stateOrder = "Hủy đơn hàng";
  //     order.cancelReason = cancelReason;

  //     await order.save();

  //     res.status(200).json({
  //       message: "Order successfully canceled",
  //       order,
  //     });
  //   } catch (error) {
  //     console.error("Error canceling order:", error);
  //     res.status(500).json({
  //       message: "Error canceling order",
  //       error: error.message || error,
  //     });
  //   }
  // },
  cancelOrder: async (req, res) => {
    try {
      const userId = req.user.id;
      const { orderId } = req.params;
      const { cancelReason } = req.body;

      const order = await Order.findOne({
        _id: orderId,
        user: userId,
        isDeleted: false,
      })
        .populate({
          path: "cartDetails",
          populate: [
            {
              path: "items.product",
              model: "product_v2",
            },
            {
              path: "items.productVariant",
              model: "productVariant",
            },
            {
              path: "items.inventory",
              model: "Inventory",
            },
            {
              path: "itemAuction.product_randBib",
              model: "productAuction",
            },
            {
              path: "itemAuction.inventory",
              model: "Inventory",
            },
            {
              path: "itemAuction.auctionWinner",
              model: "AuctionWinner",
            },
          ],
        })
        .populate("payment");

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

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Kiểm tra nếu đơn hàng có item đấu giá
      const hasAuctionItems = order.cartDetails.some(
        (detail) => detail.itemAuction && detail.itemAuction.length > 0
      );

      if (hasAuctionItems) {
        for (const detail of order.cartDetails) {
          if (detail.itemAuction) {
            for (const auctionItem of detail.itemAuction) {
              const auctionWinner = auctionItem.auctionWinner;
              if (auctionWinner) {
                // Cập nhật trạng thái của auctionWinner
                auctionWinner.confirmationStatus = "canceled";
                auctionWinner.auctionStatus = "canceled";
                auctionWinner.status = "ended";
                await auctionWinner.save();
              }
            }
          }
        }

        user.warning += 1;

        // Nếu số lần hủy vượt quá 3 lần, thay đổi trạng thái
        if (user.warning > 3) {
          user.statusAuction = "disable";
          user.noteWarning =
            "Đã hủy đơn hàng đấu giá quá số lần quy định, vui lòng liên hệ CSKH để được hỗ trợ.";
        }

        await user.save();
      }

      // Cập nhật trạng thái đơn hàng
      order.stateOrder = "Hủy đơn hàng";
      order.cancelReason = cancelReason;

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

      if (order.payment.payment_method === "Thanh toán khi nhận hàng") {
        order.stateOrder = "Hủy đơn hàng";
        order.cancelReason = cancelReason;
      } else {
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

        order.stateOrder = "Hủy đơn hàng";
        order.cancelReason = cancelReason;
        order.refundBank = {
          bankName: defaultBank.name,
          accountNumber: defaultBank.accountNumber,
          accountName: defaultBank.fullName,
        };
      }
      const orderCart = await Order.findById(orderId).populate({
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
          {
            path: "itemAuction.product_randBib",
            model: "productAuction",
          },
          {
            path: "itemAuction.inventory",
            model: "Inventory",
          },
        ],
      }).populate("user");
      const userEmail = orderCart.user.email;
      let productDetails = "";
      const hasAuctionItems = order.cartDetails.some(
        (detail) => detail.itemAuction && detail.itemAuction.length > 0
      );
      // Kiểm tra nếu không có sản phẩm trong cart hoặc trong itemAuction
      if (!hasAuctionItems) {
        productDetails = `
        <div style="margin: 20px 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); padding: 16px; transition: box-shadow 0.3s;">
            <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #2c3e50;">Thông tin sản phẩm</h2>
            <div>
    `;
        // Logic xử lý cartDetails.items nếu có
        for (const detail of orderCart.cartDetails) {
          if (detail.items) {
            for (const item of detail.items) {
              productDetails += `
                    <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                        <div style="display: flex; align-items: center;">
                            <img src="${item?.productVariant?.image?.[0]?.image?.[0] || 'https://via.placeholder.com/64'}" 
                                 alt="${item?.productVariant?.variant_name || 'No Image'}" 
                                 style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; margin-right: 16px;">
                            <div>
                                <h4 style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 0;">
                                    ${item?.productVariant?.variant_name || 'N/A'}
                                </h4>
                                <p style="color: #7f8c8d; margin: 0;">Số lượng: ${item?.quantity || 0}</p>
                            </div>
                        </div>
                        <p style="font-size: 18px; font-weight: bold; color: red; margin: 0; padding-left: 10px;">
                            ${(item?.totalItemPrice || 0).toLocaleString()} VND
                        </p>
                    </div>
                `;
            }
          }
        }
        productDetails += `</div></div>`;
      } else if (hasAuctionItems) {
        productDetails = `
        <div style="margin: 20px 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); padding: 16px; transition: box-shadow 0.3s;">
            <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #2c3e50;">Thông tin sản phẩm</h2>
            <div>
    `;
        // Nếu item là 0, kiểm tra và chạy itemAuction
        if (orderCart.cartDetails && orderCart.cartDetails.length > 0) {
          for (const detail of orderCart.cartDetails) {
            if (detail.itemAuction && detail.itemAuction.length > 0) {
              for (const item of detail.itemAuction) {
                productDetails += `
                        <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                            <div style="display: flex; align-items: center;">
                                <img src="${item?.product_randBib?.image?.[0] || 'https://via.placeholder.com/64'}" 
                                     alt="${item?.product_randBib?.product_name || 'No Image'}" 
                                     style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; margin-right: 16px;">
                                <div>
                                    <h4 style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 0;">
                                        ${item?.product_randBib?.product_name || 'N/A'}
                                    </h4>
                                    <p style="color: #7f8c8d; margin: 0;">Số lượng: ${item?.quantity || 0}</p>
                                </div>
                            </div>
                            <p style="font-size: 18px; font-weight: bold; color: red; margin: 0; padding-left: 10px;">
                                ${(item?.totalItemPrice || 0).toLocaleString()} VND
                            </p>
                        </div>
                    `;
              }
            }
          }
        }
        productDetails += `</div></div>`;
      } else {
        productDetails = `<p style="font-size: 16px; color: #7f8c8d; margin-top: 20px;">Không có sản phẩm nào trong đơn hàng.</p>`;
      }

      // Gửi email
      const mailOptions = {
        from: "E-Com <noreply@gmail.com>",
        to: userEmail,
        subject: "Cập nhật trạng thái đơn hàng của bạn",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #2c3e50; text-align: center;">Xin chào, ${orderCart.user.name}!</h1>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                  Chúng tôi rất tiếc phải thông báo rằng đơn hàng của bạn đã bị hủy. 
              </p>
              ${productDetails}
              <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                  Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này.
              </p>
              <p style="font-size: 14px; color: #7f8c8d; text-align: center; margin-top: 20px;">&copy; 2025 E-Com. All Rights Reserved.</p>
          </div>
          `,
      }

      await sendEmail(mailOptions);

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
          populate: {
            path: "items.productVariant",
            model: "productVariant",
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
          {
            path: "itemAuction.product_randBib",
            model: "productAuction",
          },
          {
            path: "itemAuction.inventory",
            model: "Inventory",
          },
        ],
      }).populate("user")
        .populate("shipping");;

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
          const hasAuctionItems = order.cartDetails.some(
            (detail) => detail.itemAuction && detail.itemAuction.length > 0
          );
          if (hasAuctionItems) {
            for (const detail of order.cartDetails) {
              for (const item of detail.itemAuction) {
                const inventory = item.inventory;
                if (!inventory) {
                  return res.status(400).json({
                    message: `Thông tin tồn kho bị thiếu cho sản phẩm ${item.product_randBib?.product_name || "không xác định"
                      }.`,
                  });
                }
                inventory.quantityShelf += item.quantity;
                await inventory.save();
              }
            }
          } else {
            for (const detail of order.cartDetails) {
              for (const item of detail.items) {
                const inventory = item.inventory;
                if (!inventory) {
                  return res.status(400).json({
                    message: `Thông tin tồn kho bị thiếu cho sản phẩm ${item.product?.name || "không xác định"
                      }.`,
                  });
                }
                inventory.quantityShelf += item.quantity;
                await inventory.save();
              }
            }
          }
        }
      }

      // Quản lý kho cho các trạng thái chuyển đổi khác
      const handleInventoryUpdate = async (items, isRestocking) => {
        const hasAuctionItems = order.cartDetails.some(
          (detail) => detail.itemAuction && detail.itemAuction.length > 0
        );
        if (hasAuctionItems) {
          for (const item of items) {
            const inventory = item.inventory;

            if (!inventory) {
              return res.status(400).json({
                message: `Thông tin tồn kho bị thiếu cho sản phẩm ${item.product_randBib?.product_name || "không xác định"
                  }.`,
              });
            }

            if (!isRestocking && inventory.quantityShelf < item.quantity) {
              return res.status(400).json({
                message: `Số lượng tồn kho không đủ cho sản phẩm ${item.product_randBib?.product_name || "không xác định"
                  }.`,
              });
            }

            inventory.quantityShelf += isRestocking
              ? item.quantity
              : -item.quantity;
            await inventory.save();
          }
        } else {
          for (const item of items) {
            const inventory = item.inventory;

            if (!inventory) {
              return res.status(400).json({
                message: `Thông tin tồn kho bị thiếu cho sản phẩm ${item.product?.name || "không xác định"
                  }.`,
              });
            }

            if (!isRestocking && inventory.quantityShelf < item.quantity) {
              return res.status(400).json({
                message: `Số lượng tồn kho không đủ cho sản phẩm ${item.product?.name || "không xác định"
                  }.`,
              });
            }

            inventory.quantityShelf += isRestocking
              ? item.quantity
              : -item.quantity;
            await inventory.save();
          }
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

      // Nếu trạng thái mới là "Hủy đơn hàng"

      if (
        stateOrder === "Hủy đơn hàng" ||
        stateOrder === "Giao hàng không thành công"
      ) {
        if (!order.user) {
          return res
            .status(404)
            .json({ message: "Thông tin người dùng không tồn tại" });
        }

        // Kiểm tra phương thức thanh toán
        if (order.payment?.payment_method !== "Thanh toán khi nhận hàng") {
          const user = await User.findById(order.user).populate("banks");
          if (!user) {
            return res
              .status(404)
              .json({ message: "Người dùng không tồn tại" });
          }

          const defaultBank =
            user.banks.find((bank) => bank.isDefault) || user.banks[0];

          if (!defaultBank) {
            return res.status(400).json({
              message:
                "Không tìm thấy thông tin ngân hàng mặc định của người dùng",
            });
          }

          // Lưu thông tin ngân hàng hoàn tiền
          order.refundBank = {
            bankName: defaultBank.name,
            accountNumber: defaultBank.accountNumber,
            accountName: defaultBank.fullName,
          };
        }

        // Lưu lý do hủy nếu cần thiết (bỏ qua nếu không có lý do cụ thể)
        // order.cancelReason = cancelReason || "Không có lý do cụ thể";
      }

      // Cập nhật trạng thái đơn hàng
      order.stateOrder = stateOrder;
      await order.save();

      if (stateOrder !== "Hoàn tất" && stateOrder !== "Giao hàng không thành công") {
        const userEmail = order.user.email;
        let productDetails = "";
        const hasAuctionItems = order.cartDetails.some(
          (detail) => detail.itemAuction && detail.itemAuction.length > 0
        );
        // Kiểm tra nếu không có sản phẩm trong cart hoặc trong itemAuction
        if (!hasAuctionItems) {
          productDetails = `
          <div style="margin: 20px 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); padding: 16px; transition: box-shadow 0.3s;">
              <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #2c3e50;">Thông tin sản phẩm</h2>
              <div>
      `;
          // Logic xử lý cartDetails.items nếu có
          for (const detail of order.cartDetails) {
            if (detail.items) {
              for (const item of detail.items) {
                productDetails += `
                      <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                          <div style="display: flex; align-items: center;">
                              <img src="${item?.productVariant?.image?.[0]?.image?.[0] || 'https://via.placeholder.com/64'}" 
                                   alt="${item?.productVariant?.variant_name || 'No Image'}" 
                                   style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; margin-right: 16px;">
                              <div>
                                  <h4 style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 0;">
                                      ${item?.productVariant?.variant_name || 'N/A'}
                                  </h4>
                                  <p style="color: #7f8c8d; margin: 0;">Số lượng: ${item?.quantity || 0}</p>
                              </div>
                          </div>
                          <p style="font-size: 18px; font-weight: bold; color: red; margin: 0; padding-left: 10px;">
                              ${(item?.totalItemPrice || 0).toLocaleString()} VND
                          </p>
                      </div>
                  `;
              }
            }
          }
          productDetails += `</div></div>`;
        } else if (hasAuctionItems) {
          productDetails = `
          <div style="margin: 20px 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); padding: 16px; transition: box-shadow 0.3s;">
              <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #2c3e50;">Thông tin sản phẩm</h2>
              <div>
      `;
          // Nếu item là 0, kiểm tra và chạy itemAuction
          if (order.cartDetails && order.cartDetails.length > 0) {
            for (const detail of order.cartDetails) {
              if (detail.itemAuction && detail.itemAuction.length > 0) {
                for (const item of detail.itemAuction) {
                  productDetails += `
                          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                              <div style="display: flex; align-items: center;">
                                  <img src="${item?.product_randBib?.image?.[0] || 'https://via.placeholder.com/64'}" 
                                       alt="${item?.product_randBib?.product_name || 'No Image'}"
                                       style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; margin-right: 16px;">
                                  <div>
                                      <h4 style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 0;">
                                          ${item?.product_randBib?.product_name || 'N/A'}
                                      </h4>
                                      <p style="color: #7f8c8d; margin: 0;">Số lượng: ${item?.quantity || 0}</p>
                                  </div>
                              </div>
                              <p style="font-size: 18px; font-weight: bold; color: red; margin: 0; padding-left: 10px;">
                                  ${(item?.totalItemPrice || 0).toLocaleString()} VND
                              </p>
                          </div>
                      `;
                }
              }
            }
          }
          productDetails += `</div></div>`;
        } else {
          productDetails = `<p style="font-size: 16px; color: #7f8c8d; margin-top: 20px;">Không có sản phẩm nào trong đơn hàng.</p>`;
        }

        // Gửi email
        const mailOptions = {
          from: "E-Com <noreply@gmail.com>",
          to: userEmail,
          subject: "Cập nhật trạng thái đơn hàng của bạn",
          html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #2c3e50; text-align: center;">Xin chào, ${order.user.name}!</h1>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Chúng tôi rất vui được thông báo rằng trạng thái đơn hàng của bạn đã được cập nhật.
                    </p>
                    <p style="background-color: #e8f4f8; padding: 15px; border-radius: 6px; text-align: center; font-size: 18px; font-weight: bold; color: #1abc9c;">
                        Trạng thái đơn hàng: ${order.stateOrder}
                    </p>
                    ${productDetails}
                    <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này.
                    </p>
                    <p style="font-size: 14px; color: #7f8c8d; text-align: center; margin-top: 20px;">&copy; 2025 E-Com. All Rights Reserved.</p>
                </div>
            `,
        };

        await sendEmail(mailOptions);
      }


      else if (stateOrder === "Hoàn tất") {
        const userEmail = order.user.email;

        // Kiểm tra xem có sản phẩm đấu giá không
        const hasAuctionItems = order.cartDetails.some(
          (detail) => detail.itemAuction && detail.itemAuction.length > 0
        );

        // Tạo bảng danh sách sản phẩm
        let productList = `
          <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px;">STT</th>
                <th style="padding: 8px;">Tên sản phẩm</th>
                <th style="padding: 8px;">Số lượng</th>
                <th style="padding: 8px;">Giá</th>
              </tr>
            </thead>
            <tbody>
        `;

        let index = 1;

        if (hasAuctionItems) {
          for (let detail of order.cartDetails) {
            for (let item of detail.itemAuction || []) {
              productList += `
                <tr>
                  <td style="padding: 8px;">${index}</td>
                  <td style="padding: 8px;">${item?.product_randBib?.product_name || "Sản phẩm không xác định"}</td>
                  <td style="padding: 8px;">${item?.quantity}</td>
                  <td style="padding: 8px;">${item?.totalItemPrice.toLocaleString("vi-VN")} VND</td>
                </tr>
              `;
              index++;
            }
          }
        } else {
          for (let detail of order.cartDetails) {
            for (let item of detail.items || []) {
              productList += `
                <tr>
                  <td style="padding: 8px;">${index}</td>
                  <td style="padding: 8px;">${item?.productVariant?.variant_name || "Sản phẩm không xác định"}</td>
                  <td style="padding: 8px;">${item?.quantity}</td>
                  <td style="padding: 8px;">${item?.totalItemPrice.toLocaleString("vi-VN")} VND</td>
                </tr>
              `;
              index++;
            }
          }
        }

        productList += `</tbody></table>`;

        // Nội dung HTML cho PDF
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 800px; margin: 20px auto;">
            <h2 style="text-align: center;">HÓA ĐƠN</h2>
            <p><strong>Tên khách hàng:</strong> ${order.user.name}</p>
            <p><strong>Số điện thoại:</strong> ${order.shipping.phoneNumber}</p>
            <p><strong>Địa chỉ:</strong> ${order.shipping.address}</p>
            <p><strong>Tổng tiền:</strong> ${order.totalPriceWithShipping.toLocaleString("vi-VN")} VND</p>
            <h3>Danh sách sản phẩm:</h3>
            ${productList}
          </div>
        `;

        (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
          const pdfBuffer = await page.pdf({ format: "A4" });

          await browser.close();

          const mailOptions = {
            from: "E-Com <noreply@gmail.com>",
            to: userEmail,
            subject: "Hóa đơn",
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #2c3e50; text-align: center;">Xin chào, ${order.user.name}!</h1>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                  Chúng tôi xin gửi đến bạn hóa đơn cho đơn hàng của bạn. Vui lòng kiểm tra file đính kèm để xem chi tiết đơn hàng.
                </p>
                <p style="background-color: #e8f4f8; padding: 15px; border-radius: 6px; text-align: center; font-size: 18px; font-weight: bold; color: #1abc9c;">
                  Cảm ơn bạn đã tin tưởng và ủng hộ dịch vụ của <strong>E-Com</strong>.
                </p>
                <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                  Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này.
                </p>
                <p style="font-size: 14px; color: #7f8c8d; text-align: center; margin-top: 20px;">&copy; 2025 E-Com. All Rights Reserved.</p>
              </div>
            `,
            attachments: [
              {
                filename: `Hoadon.pdf`,
                content: pdfBuffer,
              },
            ],
          };

          await sendEmail(mailOptions);
        })();
      }


      else {
        const userId = order.user.id;
        const user = await User.findById(userId);
        console.log(user);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const hasAuctionItems = order.cartDetails.some(
          (detail) => detail.itemAuction && detail.itemAuction.length > 0
        );

        // Chỉ tăng cảnh báo nếu có sản phẩm đấu giá
        if (hasAuctionItems) {
          let productDetails = "";
          const userEmail = order.user.email;
          user.warning += 1;
          productDetails = `
          <div style="margin: 20px 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); padding: 16px; transition: box-shadow 0.3s;">
              <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #2c3e50;">Thông tin sản phẩm</h2>
              <div>
      `;
          // Nếu item là 0, kiểm tra và chạy itemAuction
          if (order.cartDetails && order.cartDetails.length > 0) {
            for (const detail of order.cartDetails) {
              if (detail.itemAuction && detail.itemAuction.length > 0) {
                for (const item of detail.itemAuction) {
                  productDetails += `
                          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                              <div style="display: flex; align-items: center;">
                                  <img src="${item?.product_randBib?.image?.[0] || 'https://via.placeholder.com/64'}" 
                                       alt="${item?.product_randBib?.product_name || 'No Image'}"
                                       style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; margin-right: 16px;">
                                  <div>
                                      <h4 style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 0;">
                                          ${item?.product_randBib?.product_name || 'N/A'}
                                      </h4>
                                      <p style="color: #7f8c8d; margin: 0;">Số lượng: ${item?.quantity || 0}</p>
                                  </div>
                              </div>
                              <p style="font-size: 18px; font-weight: bold; color: red; margin: 0; padding-left: 10px;">
                                  ${(item?.totalItemPrice || 0).toLocaleString()} VND
                              </p>
                          </div>
                      `;
                }
              }
            }
          }
          productDetails += `</div></div>`;

          const mailOptions = {
            from: "E-Com <noreply@gmail.com>",
            to: userEmail,
            subject: "Cảnh báo",
            html: `
                  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                      <h1 style="color: #2c3e50; text-align: center;">Xin chào, ${order.user.name}!</h1>
                      <p style="background-color: #F8D7DA; padding: 15px; border-radius: 6px; text-align: center; font-size: 18px; font-weight: bold; color: red;">
                          Hệ thống phát hiện đơn hàng của bạn đã không được nhận. Nếu tiếp tục bom hàng, tài khoản của bạn sẽ bị cấm đấu giá.
                      </p>
                      ${productDetails}
                      <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                          Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này.
                      </p>
                      <p style="font-size: 14px; color: #7f8c8d; text-align: center; margin-top: 20px;">&copy; 2025 E-Com. All Rights Reserved.</p>
                  </div>
              `,
          };
  
          await sendEmail(mailOptions);
          // Nếu số lần hủy vượt quá 3 lần, thay đổi trạng thái
          if (user.warning > 3) {
            user.status = "disable";
            user.noteWarning =
              "Đã hủy đơn hàng đấu giá quá số lần quy định, vui lòng liên hệ CSKH để được hỗ trợ.";

              const mailOptions = {
                from: "E-Com <noreply@gmail.com>",
                to: userEmail,
                subject: "Cảnh báo",
                html: `
                      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                          <h1 style="color: #2c3e50; text-align: center;">Xin chào, ${order.user.name}!</h1>
                          <p style="background-color: #F8D7DA; padding: 15px; border-radius: 6px; text-align: center; font-size: 18px; font-weight: bold; color: red;">
                              Tài khoản của bạn đã bị cấm đấu giá.
                          </p>
                          <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này.
                          </p>
                          <p style="font-size: 14px; color: #7f8c8d; text-align: center; margin-top: 20px;">&copy; 2025 E-Com. All Rights Reserved.</p>
                      </div>
                  `,
              };
      
              await sendEmail(mailOptions);
          }

          await user.save();
        }
      }




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
