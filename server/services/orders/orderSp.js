const Order = require("../../model/orders/orderCart/orders");
const mongoose = require("mongoose");
const OrderService = {
  getOrderLimitService: (page, search, stateOrder) =>
    new Promise(async (resolve, reject) => {
      try {
        const limit = parseInt(process.env.LIMIT, 10) || 3;
        const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;

        // Xây dựng query tìm kiếm
        let searchQuery = { isDeleted: false };

        if (search) {
          // Kiểm tra nếu search là ObjectId hợp lệ
          if (search) {
            searchQuery = { ...searchQuery, _id: search };
          } else {
            searchQuery = {
              ...searchQuery,
              order_number: { $regex: search, $options: "i" },
            };
          }
        }

        if (stateOrder) {
          searchQuery = { ...searchQuery, stateOrder };
        }

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
  // getOrderLimitService: (page, search) =>
  //   new Promise(async (resolve, reject) => {
  //     try {
  //       const limit = parseInt(process.env.LIMIT, 10) || 3;
  //       const offset = !page || +page <= 1 ? 0 : (+page - 1) * limit;

  //       const searchQuery = search
  //         ? {
  //             status: { $ne: "disable" },
  //             product_name: { $regex: search, $options: "i" },
  //           }
  //         : { status: { $ne: "disable" } };

  //       const orders = await Order.find(searchQuery)
  //         .skip(offset)
  //         .limit(limit)
  //         .populate("cartDetails")
  //         .populate("payment")
  //         .populate("shipping")
  //         .populate({
  //           path: "voucherIds",
  //           model: "Voucher",
  //         })
  //         .populate({
  //           path: "cartDetails",
  //           populate: {
  //             path: "items.product",
  //             model: "product_v2",
  //           },
  //         })
  //         .populate({
  //           path: "cartDetails",
  //           populate: {
  //             path: "items.productVariant",
  //             model: "productVariant",
  //           },
  //         })
  //         .lean();

  //       const total = await Order.countDocuments(searchQuery);

  //       resolve({
  //         success: true,
  //         err: 0,
  //         msg: orders.length ? "OK" : "No Order found.",
  //         status: 200,
  //         response: {
  //           total: total,
  //           orders: orders,
  //         },
  //       });
  //     } catch (error) {
  //       reject({
  //         success: false,
  //         err: 1,
  //         msg: `Đã xảy ra sự cố khi lấy đơn hàng: ${error.message}`,
  //         status: 500,
  //       });
  //     }
  //   }),
};

module.exports = OrderService;
