const express = require("express");
const router = express.Router();
const CartController = require("../../controler/product/carts");
const middlewareController = require("../../middleware/auth");
// Tạo mới giỏ hàng
router.post(
  "/add",
  middlewareController.verifyToken,
  CartController.createCart
);

// Lấy danh sách tất cả các giỏ hàng
router.get("/list", middlewareController.verifyToken, CartController.getCarts);

// Lấy chi tiết một giỏ hàng theo ID
router.get(
  "/:id",
  middlewareController.verifyToken,
  CartController.getCartById
);

router.put("/:id", middlewareController.verifyToken, CartController.updateCart);

// Xóa giỏ hàng theo ID
router.delete(
  "/:id",
  middlewareController.verifyToken,
  CartController.deleteCart
);

module.exports = router;
