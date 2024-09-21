const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.middle");
const middlewareController = require("../../../middleware/auth");
const {
  list,
  add,
  addVariant,
  softDelete,
  update,
  selectbrand,
  restore,
  selectSupplier,
  selectDiscount,
  selectProductFormat,
  selectConditionShopping,
  selectCategories,
  getOne,
  getProductLimit,
  deletedList,
  hardDelete,
} = require("../../../controler/admin/product_v2");
router.get("/list", list);
router.post("/add", upload.array("image"), add);
router.post("/:product_id/addvariant", upload.array("image"), addVariant);
router.patch("/softDelete/:id", middlewareController.verifyToken, softDelete);
router.get("/selectbrand", selectbrand);
router.get("/selectsupplier", selectSupplier);
router.get("/selectdiscount", selectDiscount);
router.get("/selectProductFormat", selectProductFormat);
router.get("/selectConditionSP", selectConditionShopping);
router.get("/selectCategories", selectCategories);
router.get("/getone/:id", getOne);
router.patch("/restore/:id", middlewareController.verifyToken, restore);
router.delete("/hardDelete/:id", middlewareController.verifyToken, hardDelete);
router.get("/deletedlist", middlewareController.verifyToken, deletedList);
router.get("/limit", getProductLimit);
router.put(
  "/update/:id",
  middlewareController.verifyToken,
  upload.array("image"),
  update
);

module.exports = router;
