const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.middle");

const {
  listInbounds,
  listInboundV2,
  addInbound,
  addInboundProduct,
  getAllSuppliersController,
  getProductController,
  getProductV2Controller,
  getOne,
  getOneV2,
  search,
  searchV2,
  editInbound,
  editInboundV2,
  hardDelete,
  softDelete,
  deletedList,
  restore,
  searchDelete

} = require("../../../controler/admin/inboundController");

const middlewareController = require("../../../middleware/auth");

router.get("/list", listInbounds);
router.get("/listV2", listInboundV2);

router.post(
  "/add",
  middlewareController.verifyToken,
  addInbound
);
router.post(
  "/addProductV2",
  middlewareController.verifyToken,
  addInboundProduct
);

router.get("/listProduct",
  getProductController);
router.get("/listSupplier",
  getAllSuppliersController);
router.get("/get-one/:id", getOne);
router.get("/get-oneV2/:id", getOneV2);

router.get("/search", search);
router.get("/searchV2", searchV2);

router.put(
  "/update/:id",
  editInbound
);

router.put(
  "/updateV2/:id",
  editInboundV2
);
router.get("/listProductV2",
  getProductV2Controller);
router.delete("/hard-delete/:id",
  middlewareController.verifyToken,
  hardDelete
);
router.patch("/soft-delete/:id",
  middlewareController.verifyToken,
  softDelete);

router.get("/deleted-list",
  middlewareController.verifyToken,
  deletedList);

router.patch("/restore/:id",
  middlewareController.verifyToken,
  restore);
router.get("/searchDelete", searchDelete);

module.exports = router;
