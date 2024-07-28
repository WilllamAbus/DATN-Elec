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
const discountController = require('../controler/discount.controller')

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

router.post("/addCate",middlewareController.verifyTokenAdminAuth, upload.single("imgCate"), uploadCategory);
router.get("/getAllCate", getAllCategoriesController);
router.get("/getCate/:id", getCategoryByIdController);
router.put("/updateCate/:id",middlewareController.verifyTokenAdminAuth, upload.single("imgCate"), updateCategoryController);
router.delete("/delete/:id",middlewareController.verifyTokenAdminAuth, deleteCategoryController);


// discount
router.post("/addDiscount",middlewareController.verifyTokenAdminAuth, discountController.createDiscount);
router.get("/getAllDiscount", discountController.getAllDiscounts);
router.get("/getDiscount/:id", discountController.getDiscountById);
router.put("/updateDiscount/:id",middlewareController.verifyTokenAdminAuth, discountController.updateDiscount);
router.delete("/deleteDiscount/:id",middlewareController.verifyTokenAdminAuth, discountController.deleteDiscount);

module.exports = router;
