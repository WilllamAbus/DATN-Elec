const Order = require("../../model/orders/orderCart/orders");

const OrderService = {
  getOrderLimitService: (page, search) =>
    new Promise(async (resolve, reject) => {
      try {
        const limit = parseInt(process.env.LIMIT, 10) || 3;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;
        const searchQuery = search
          ? {
              isDeleted: false,
              order_number: { $regex: search, $options: "i" },
            }
          : { isDeleted: false };

        const orders = await Order.find(searchQuery)
          .skip(offset)
          .limit(limit)
          .populate("cartDetails")
          .populate("payment")
          .populate("shipping")
          .populate({
            path: "voucherIds",
            model: "Voucher",
          })
          .lean();

        const total = await Order.countDocuments(searchQuery);

        resolve({
          success: true,
          err: 0,
          msg: orders.length ? "OK" : "No orders found.",
          status: 200,
          response: {
            total,
            orders,
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
