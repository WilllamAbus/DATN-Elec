const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/multer.middle");

const {
  listSuppliers,
  addSupplier,
  getOne,
  update,
  hardDelete,
  softDelete,
  deletedList,
  restore,
  search,
  searchDelete
} = require("../../../controler/admin/supplierController");

const middlewareController = require("../../../middleware/auth");

router.get("/list", listSuppliers);
router.post(
  "/add",
  middlewareController.verifyToken,

  upload.single("image"),
  addSupplier
);
router.get("/get-one/:id", getOne);
router.put(
  "/update/:id",
  middlewareController.verifyToken,
  upload.single("image"),
  update
);
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

router.get("/search", search);
router.get("/searchDelete", searchDelete);

module.exports = router;
