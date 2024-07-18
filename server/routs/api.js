const express = require("express");
const multer = require("multer");
const { homepage, message } = require("../controler/home");
// regisOTP
const { verifyOtp, regisUser } = require("../controler/user.controller");
// middleware
const { checkPermission } = require("../middleware/role.base");

const { createRole } = require("../controler/role.controller");
// categories
const {
  uploadCategory,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controler/categories.controller");

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
const upload = multer({ storage: multer.memoryStorage() });
router.post("/addCate", upload.single("image"), uploadCategory);
router.get("/getAllCate", getAllCategoriesController);
router.get("/getCate/:id", getCategoryByIdController);
router.put("/updateCate/:id", upload.single("image"), updateCategoryController);
router.delete("/delete/:id", deleteCategoryController);
module.exports = router;
