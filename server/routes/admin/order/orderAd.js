const express = require("express");
const router = express.Router();
const orderController = require("../../../controler/orders/orderCart/order");
const orderDetail = require("../../../controler/orders/orderCart/OrderDetail");
const middlewareController = require("../../../middleware/auth"); // Lấy danh sách đơn hàng của người dùng
router.get(
  "/listOrder",
  middlewareController.verifyTokenAdminAuth,
  orderController.getOrders
);
router.get(
  "/limit",
  middlewareController.verifyTokenAdminAuth,
  orderController.getOrderLimit
);
router.get(
  "/getSoftOrder/limit",
  middlewareController.verifyTokenAdminAuth,
  orderDetail.getSoftdeleteOrder
);
// Lấy chi tiết đơn hàng
router.get(
  "/detail/:orderId",
  orderDetail.getOrderById,
  middlewareController.verifyTokenAdminAuth
);
router.put(
  "/cancel/:orderId",
  middlewareController.verifyTokenAdminAuth,
  orderController.cancelOrderAdmin
);
// Cập nhật trạng thái đơn hàng
router.put(
  "/status/:orderId",
  orderController.updateOrderStatus,
  middlewareController.verifyTokenAdminAuth
);
//khôi phục
router.put(
  "/restore/:orderId",
  orderController.restoreOrder,
  middlewareController.verifyTokenAdminAuth
);

// Xóa đơn hàng
router.delete(
  "/delete/:orderId",
  orderController.deleteOrder,
  middlewareController.verifyTokenAdminAuth
);
module.exports = router;
