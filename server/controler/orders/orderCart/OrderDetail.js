const OrderDetail = require("../../../model/orders/orderCart/OrderDetails");
const Order = require("../../../model/orders/orderCart/orders");
const OrderService = require("../../../services/orders/orderSp");
const OrderController = {
  // getOrderById: async (req, res) => {
  //   try {
  //     const { orderId } = req.params;
  //     const order = await OrderDetail.findOne({ order: orderId }).populate({
  //       path: "order",
  //       populate: [
  //         { path: "payment", model: "payment" },
  //         { path: "shipping", model: "shipping" },
  //         {
  //           path: "cartDetails",
  //           model: "OrderDetail",
  //           populate: [
  //             {
  //               path: "items.product",
  //               model: "product_v2",
  //             },
  //             {
  //               path: "items.productVariant",
  //               model: "productVariant",
  //               populate: [
  //                 { path: "image", model: "ImageVariant" },
  //                 { path: "battery", model: "Battery" },
  //                 { path: "color", model: "Color" },
  //                 { path: "cpu", model: "Cpu" },
  //                 { path: "operatingSystem", model: "OperatingSystem" },
  //                 { path: "ram", model: "Ram" },
  //                 { path: "screen", model: "Screen" },
  //                 { path: "storage", model: "Storage" },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     if (!order) return res.status(404).json({ message: "Order not found" });

  //     const itemsWithDeletedProducts = order.items.filter(
  //       (item) => !item.product
  //     );

  //     if (itemsWithDeletedProducts.length > 0) {
  //       console.log("Deleted Products:", itemsWithDeletedProducts);

  //       order.items = order.items.filter((item) => item.product);

  //       return res.status(200).json({
  //         ...order.toObject(),
  //         message: "Some products have been deleted",
  //         deletedProducts: itemsWithDeletedProducts.map((item) => ({
  //           quantity: item.quantity,
  //           price: item.price,
  //         })),
  //       });
  //     }

  //     res.status(200).json(order);
  //   } catch (error) {
  //     console.error("Error fetching order details:", error);
  //     res.status(500).json({ message: "Error fetching order", error });
  //   }
  // },
  getOrderById: async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await OrderDetail.findOne({ order: orderId })
        .populate({
          path: "order",
          populate: [
            { path: "payment", model: "payment" },
            { path: "shipping", model: "shipping" },
          ],
        })
        .populate({
          path: "itemAuction.product_randBib",
          model: "productAuction",
        })
        .populate({
          path: "items.product",
          model: "product_v2",
        })
        .populate({
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
        });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const deletedItemAuctions = order.itemAuction.filter(
        (item) => !item.product_randBib
      );
      const deletedItems = order.items.filter((item) => !item.product);

      order.itemAuction = order.itemAuction.filter(
        (item) => item.product_randBib
      );
      order.items = order.items.filter((item) => item.product);

      const responsePayload = order.toObject();

      // Nếu có sản phẩm bị xóa, trả về thông tin chi tiết
      if (deletedItemAuctions.length > 0 || deletedItems.length > 0) {
        return res.status(200).json({
          ...responsePayload,
          message: "Some products have been deleted",
          deletedProducts: {
            deletedItemAuctions: deletedItemAuctions.map((item) => ({
              quantity: item.quantity,
              price: item.price,
            })),
            deletedItems: deletedItems.map((item) => ({
              quantity: item.quantity,
              price: item.price,
            })),
          },
        });
      }

      res.status(200).json(responsePayload);
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ message: "Error fetching order", error });
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
  // getSoftdeleteOrder: async (req, res) => {
  //   const userId = req.user.id;
  //   try {
  //     if (!userId) {
  //       return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
  //     }

  //     const orders = await Order.find({ isDeleted: true })
  //       .populate({
  //         path: "cartDetails",
  //         populate: {
  //           path: "items.product",
  //           model: "product_v2",
  //         },
  //       })
  //       .populate("payment")
  //       .populate("shipping")
  //       .populate({
  //         path: "voucherIds",
  //         model: "Voucher",
  //       });

  //     if (!orders || orders.length === 0) {
  //       return res.status(404).json({ message: "Không có đơn hàng nào" });
  //     }

  //     res.status(200).json({ orders });
  //   } catch (error) {
  //     console.error("Error fetching all orders:", error);
  //     res.status(500).json({
  //       message: "Lỗi khi lấy đơn hàng",
  //       error: error.message || error,
  //     });
  //   }
  // },
  getSoftdeleteOrder: async (req, res) => {
    const userId = req.user.id;
    const { page, search, stateOrder } = req.query;

    try {
      if (!userId) {
        return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
      }
      const response = await OrderService.getDeletedLimitService(
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

module.exports = OrderController;
