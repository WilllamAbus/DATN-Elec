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

        const orders = await Order.find(searchQuery)
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
            populate: {
              path: "items.product",
              model: "product_v2",
            },
          })
          .populate({
            path: "cartDetails",
            populate: {
              path: "items.productVariant",
              model: "productVariant",
            },
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
            populate: {
              path: "items.product",
              model: "product_v2",
            },
          })
          .populate({
            path: "cartDetails",
            populate: {
              path: "items.productVariant",
              model: "productVariant",
            },
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
};

module.exports = OrderService;
