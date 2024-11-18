const express = require("express");
const router = express.Router();
const BankController = require("../../../controler/bank");
const authMiddleware = require("../../../middleware/auth");

// Thêm ngân hàng mới
router.post("/add", authMiddleware.verifyToken, BankController.addBank);

// Lấy danh sách ngân hàng của người dùng
router.get("/", authMiddleware.verifyToken, BankController.getBanks);

// Cập nhật thông tin ngân hàng
router.put("/:bankId", authMiddleware.verifyToken, BankController.updateBank);

// Xóa ngân hàng khỏi danh sách
router.delete(
  "/:bankId",
  authMiddleware.verifyToken,
  BankController.deleteBank
);
router.put(
  "/default/:bankId",
  authMiddleware.verifyToken,
  BankController.setDefaultBank
);
module.exports = router;
