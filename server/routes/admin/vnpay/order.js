const express = require("express");
const router = express.Router();
const paymentController = require("../../../controler/admin/vnpay/order");

router.get("/", (req, res) =>
  res.render("orderlist", { title: "Danh sách đơn hàng" })
);
router.get("/create_payment_url", (req, res) =>
  res.render("order", { title: "Tạo mới đơn hàng", amount: 10000 })
);
router.get("/querydr", (req, res) =>
  res.render("querydr", { title: "Truy vấn kết quả thanh toán" })
);
router.get("/refund", (req, res) =>
  res.render("refund", { title: "Hoàn tiền giao dịch thanh toán" })
);

router.post(
  "/create_payment_url",

  paymentController.createPaymentUrl
);
router.get(
  "/vnpay_return",

  paymentController.vnpayReturn
);
router.get(
  "/vnpay_ipn",

  paymentController.vnpayIpn
);

router.post(
  "/querydr",

  paymentController.queryDr
);
router.post(
  "/refund",

  paymentController.refund
);

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const paymentController = require("../../../controler/admin/vnpay/order");
// const middlewareController = require("../../../middleware/auth");

// // Middleware bảo vệ toàn bộ router
// // router.use(middlewareController.auth);

// router.get("/", (req, res) =>
//   res.render("orderlist", { title: "Danh sách đơn hàng" })
// );

// router.get("/create_payment_url", (req, res) =>
//   res.render("order", { title: "Tạo mới đơn hàng", amount: 10000 })
// );

// router.get("/querydr", middlewareController.verifyToken, (req, res) =>
//   res.render("querydr", { title: "Truy vấn kết quả thanh toán" })
// );

// router.get("/refund", middlewareController.verifyToken, (req, res) =>
//   res.render("refund", { title: "Hoàn tiền giao dịch thanh toán" })
// );

// router.post(
//   "/create_payment_url",
//   middlewareController.verifyToken,
//   paymentController.createPaymentUrl
// );

// router.get(
//   "/vnpay_return",
//   middlewareController.verifyToken,
//   paymentController.vnpayReturn
// );

// router.get(
//   "/vnpay_ipn",
//   middlewareController.verifyToken,
//   paymentController.vnpayIpn
// );

// router.post(
//   "/querydr",
//   middlewareController.verifyToken,
//   paymentController.queryDr
// );

// router.post(
//   "/refund",
//   middlewareController.verifyToken,
//   paymentController.refund
// );

// module.exports = router;
