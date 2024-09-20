const express = require("express");
const router = express.Router();
const orderDetailController = require("../../../controler/orders/orderCart/OrderDetail");
const middlewareController = require("../../../middleware/auth");
// Route để tạo chi tiết đơn hàng mới
// router.post("/", orderDetailController.createOrderDetail);
// lấy tất cả threo id người dùng
router.get(
  "/userorder",
  orderDetailController.getUserOrders,
  middlewareController.verifyToken
);
// Route để lấy tất cả chi tiết đơn hàng
router.get("/", orderDetailController.getAllOrderDetails);

// Route để lấy chi tiết đơn hàng theo ID
router.get(
  "/:id",
  orderDetailController.getOrderById,
  middlewareController.verifyToken
);

// Route để cập nhật chi tiết đơn hàng theo ID
router.put("/:id", orderDetailController.updateOrderDetailById);

// Route để xóa chi tiết đơn hàng theo ID
router.delete("/:id", orderDetailController.deleteOrderDetailById);

module.exports = router;
