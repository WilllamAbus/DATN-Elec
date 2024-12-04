const cron = require("node-cron");
const modelUser = require("../model/users.model");
const modelOrder = require("../model/orders/orderCart/orders");

cron.schedule("* * * * *", async () => {
  // Chạy mỗi phút
  try {
    console.log("Cron job đã được khởi chạy tại:", new Date());

    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 ngày trước
    // thresholdDate.setTime(now.getTime() - 30 * 1000); //30s để test

    // 1. Xóa tài khoản bị disable hơn 30 ngày
    const usersToDelete = await modelUser.find({
      status: "disable",
      disabledAt: { $lte: thresholdDate },
    });

    if (usersToDelete.length > 0) {
      await modelUser.deleteMany({
        _id: { $in: usersToDelete.map((user) => user._id) },
      });
      console.log(`Đã xóa ${usersToDelete.length} tài khoản`);
    }

    // 2. Xóa đơn hàng có trạng thái 'disable' hơn 30 ngày
    const ordersToDelete = await modelOrder.find({
      isDeleted: true,
      deletedAt: { $lte: thresholdDate }, // Bị xóa mềm hơn 30 ngày trước
    });

    if (ordersToDelete.length > 0) {
      await modelOrder.deleteMany({
        _id: { $in: ordersToDelete.map((order) => order._id) },
      });
      console.log(`Đã xóa vĩnh viễn ${ordersToDelete.length} đơn hàng`);
    }
  } catch (error) {
    console.error("Lỗi khi xóa vĩnh viễn tài khoản hoặc đơn hàng:", error);
  }
});
// const cron = require("node-cron");
// const modelUser = require("../model/users.model");

// cron.schedule("* * * * *", async () => {
//   // Chạy mỗi phút
//   try {
//     console.log("Cron job đã được khởi chạy tại:", new Date());

//     const now = new Date();
//     const thresholdDate = new Date();
//     // thresholdDate.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 ngày trước
//     thresholdDate.setTime(now.getTime() - 30 * 1000);
//     // Tìm các tài khoản đã bị disable hơn 30 ngày
//     const usersToDelete = await modelUser.find({
//       status: "disable",
//       disabledAt: { $lte: thresholdDate },
//     });

//     if (usersToDelete.length > 0) {
//       await modelUser.deleteMany({
//         _id: { $in: usersToDelete.map((user) => user._id) },
//       });
//       console.log(`Đã xóa ${usersToDelete.length} tài khoản`);
//     } else {
//       console.log("Không có tài khoản nào cần xóa.");
//     }
//   } catch (error) {
//     console.error("Lỗi khi xóa vĩnh viễn tài khoản:", error);
//   }
// });
