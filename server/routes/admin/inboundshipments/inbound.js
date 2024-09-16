const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.middle");

const {
  listInbounds,
  addInbound,
  getAllSuppliersController,
  getProductController,
  getOne,
  search

} = require("../../../controler/admin/inboundController");

const middlewareController = require("../../../middleware/auth");

router.get("/list", listInbounds);
router.post(
  "/add",
  middlewareController.verifyToken,
  addInbound
);

router.get("/listProduct",
  getProductController);
router.get("/listSupplier",
  getAllSuppliersController);
router.get("/get-one/:id", getOne);
router.get("/search", search);


module.exports = router;
