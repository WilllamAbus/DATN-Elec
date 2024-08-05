const express = require("express");

const { homepage, message } = require("../controler/home");
// regisOTP
const { verifyOtp, regisUser } = require("../controler/user.controller");
// middleware
const { checkPermission } = require("../middleware/role.base");
const middlewareController = require("../middleware/auth");
const upload = require('../middleware/multer.middle');
const { createRole } = require("../controler/role.controller");
// const middlewareController = require('../middleware/auth');
// categories
const {
  uploadCategory,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controler/categories.controller");


// discount
const voucherController = require('../controler/voucher.controller')


// order
const orderController = require('../controler/order.controller')
const router = express.Router();
// Test
router.get("/", homepage);
router.get("/message", message);
// Users - regisOTP
router.post("/users", regisUser);
router.post("/users/verifyOtp", verifyOtp);

// Add Roles
router.post("/addRole", checkPermission, createRole);

// Categoris

router.post("/addCate",middlewareController.verifyToken, upload.single("imgCate"), uploadCategory);
router.get("/getAllCate", getAllCategoriesController);
router.get("/getCate/:id", getCategoryByIdController);
router.put("/updateCate/:id",middlewareController.verifyToken, upload.single("imgCate"), updateCategoryController);
router.delete("/delete/:id",middlewareController.verifyToken, deleteCategoryController);


// discount
router.post("/addVoucher",middlewareController.verifyToken, voucherController.createVoucher);
router.get("/getAllVoucher", voucherController.getAllVoucher);
router.get("/getVoucher/:id", voucherController.getVoucherById);
router.put("/updateVoucher/:id",middlewareController.verifyToken, voucherController.updateVoucher);
router.delete("/deleteVoucher/:id",middlewareController.verifyToken, voucherController.deleteVoucher);


// order
router.post("/addOrder",middlewareController.verifyToken, orderController.createOrder);
router.get("/getAllOrder", orderController.getAllOrder);
router.get("/getOrder/:id", orderController.getOrderbyId);
router.delete("/deleteOrder/:id",middlewareController.verifyToken, orderController.deleteOrderById);
// 
module.exports = router;
