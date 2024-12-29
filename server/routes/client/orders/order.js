const express = require("express");
const router = express.Router();
const orderController = require("../../../controler/orders/orderCart/order");
const middlewareController = require("../../../middleware/auth");
// Tạo đơn hàng mới
router.post(
  "/create",
  middlewareController.verifyToken,
  orderController.createOrder
);
router.post(
  "/createAuction",
  middlewareController.verifyToken,
  orderController.createOrderAuction
);
// Lấy danh sách đơn hàng của người dùng
router.get(
  "/listOrder",
  middlewareController.verifyToken,
  orderController.getOrders
);
router.get(
  "/limit",
  middlewareController.verifyToken,
  orderController.getUserOrders
);
router.get(
  "/:orderId",
  middlewareController.verifyToken,
  orderController.getOrderById
);
router.put(
  "/cancel/:orderId",
  middlewareController.verifyToken,
  orderController.cancelOrder
);

// Lấy chi tiết đơn hàng
router.get("/detail/:orderId", orderController.getOrderById);

// Cập nhật trạng thái đơn hàng
router.put("/status/:orderId", orderController.updateOrderStatus);
//khôi phục
router.put("/restore/:orderId", orderController.restoreOrder);

// Xóa đơn hàng
router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;
