const Order = require("../../model/orders/orderCart/orders");

const OrderService = {
  getOrderLimitService: (page, search, stateOrder) =>
    new Promise(async (resolve, reject) => {
      try {
        const limit = parseInt(process.env.LIMIT, 10) || 3;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;

        let searchQuery = { isDeleted: false };

        if (stateOrder) {
          searchQuery = { ...searchQuery, stateOrder };
        }

        // const orders = await Order.find(searchQuery)
        //   .sort({ createdAt: -1 })
        //   .skip(offset)
        //   .limit(limit)
        //   .populate({
        //     path: "shipping",
        //     match: search
        //       ? {
        //           $or: [
        //             { phoneNumber: { $regex: search, $options: "i" } },
        //             { recipientName: { $regex: search, $options: "i" } },
        //           ],
        //         }
        //       : undefined,
        //   })
        //   .populate("cartDetails")
        //   .populate("payment")
        //   .populate({
        //     path: "voucherIds",
        //     model: "Voucher",
        //   })
        //   .populate({
        //     path: "cartDetails",
        //     populate: {
        //       path: "items.product",
        //       model: "product_v2",
        //     },
        //   })
        //   .populate({
        //     path: "cartDetails",
        //     populate: {
        //       path: "items.productVariant",
        //       model: "productVariant",
        //     },
        //   })
        //   .lean();
        const orders = await Order.find(searchQuery)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .populate({
            path: "shipping",
            match: search
              ? {
                  $or: [
                    { phoneNumber: { $regex: search, $options: "i" } },
                    { recipientName: { $regex: search, $options: "i" } },
                  ],
                }
              : undefined,
          })
          .populate("cartDetails")
          .populate("payment")
          .populate({
            path: "voucherIds",
            model: "Voucher",
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
                path: "itemAuction.product_randBib",
                model: "productAuction",
              },
            ],
          })
          .lean();

        const filteredOrders = orders.filter((order) => order.shipping);

        const total = filteredOrders.length;

        resolve({
          success: true,
          err: 0,
          msg: filteredOrders.length ? "OK" : "No orders found.",
          status: 200,
          response: {
            total,
            orders: filteredOrders,
          },
        });
      } catch (error) {
        reject({
          success: false,
          err: 1,
          msg: "Error retrieving orders: " + error.message,
          status: 500,
        });
      }
    }),

  getDeletedLimitService: (page, search, stateOrder) =>
    new Promise(async (resolve, reject) => {
      try {
        const limit = parseInt(process.env.LIMIT, 10) || 3;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;

        let searchQuery = { isDeleted: true };

        if (stateOrder) {
          searchQuery = { ...searchQuery, stateOrder };
        }

        const orders = await Order.find(searchQuery)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
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
                path: "itemAuction.product_randBib",
                model: "productAuction",
              },
            ],
          })
          .populate("payment")
          .populate({
            path: "shipping",
            match: search
              ? {
                  $or: [
                    { phoneNumber: { $regex: search, $options: "i" } },
                    { recipientName: { $regex: search, $options: "i" } },
                  ],
                }
              : undefined,
          })
          .populate({
            path: "voucherIds",
            model: "Voucher",
          })
          .lean();

        const filteredOrders = orders.filter((order) => order.shipping);

        const total = filteredOrders.length;

        resolve({
          success: true,
          err: 0,
          msg: filteredOrders.length ? "OK" : "No orders found.",
          status: 200,
          response: {
            total,
            orders: filteredOrders,
          },
        });
      } catch (error) {
        reject({
          success: false,
          err: 1,
          msg: "Error retrieving orders: " + error.message,
          status: 500,
        });
      }
    }),
  getUserOrderService: (userId, page, search, stateOrder) =>
    new Promise(async (resolve, reject) => {
      try {
        if (!userId) {
          return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
        }

        const limit = parseInt(process.env.LIMIT, 10) || 3;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;

        let searchQuery = { user: userId, isDeleted: false };

        if (stateOrder) {
          searchQuery = { ...searchQuery, stateOrder };
        }

        const orders = await Order.find(searchQuery)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
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
                path: "itemAuction.product_randBib",
                model: "productAuction",
              },
            ],
          })
          .populate("payment")
          .populate({
            path: "shipping",
            match: search
              ? {
                  $or: [
                    { phoneNumber: { $regex: search, $options: "i" } },
                    { recipientName: { $regex: search, $options: "i" } },
                  ],
                }
              : undefined,
          })
          .populate({
            path: "voucherIds",
            model: "Voucher",
          })
          .lean();
        console.log(orders);
        const filteredOrders = orders.filter((order) => order.shipping);

        const totalOrders = await Order.countDocuments(searchQuery);

        resolve({
          success: true,
          err: 0,
          msg: filteredOrders.length ? "OK" : "No orders found.",
          status: 200,
          response: {
            total: totalOrders,
            currentPage: +page || 1,
            totalPages: Math.ceil(totalOrders / limit),
            orders: filteredOrders,
          },
        });
      } catch (error) {
        reject({
          success: false,
          err: 1,
          msg: "Error retrieving orders: " + error.message,
          status: 500,
        });
      }
    }),
};

module.exports = OrderService;
