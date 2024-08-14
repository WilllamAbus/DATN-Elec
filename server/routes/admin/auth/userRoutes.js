const express = require("express");
const router = express.Router();
const {
  add,
  hardDelete,
  softDelete,
  deletedList,
  restore,
  getOne,
  update,
  list,
} = require("../../../controler/admin/authController");
const middlewareController = require("../../../middleware/auth");
const upload = require("../../../middleware/multer.middle");
router.post("/add", add);
router.delete("/delete/:id", hardDelete);
router.patch(
  "/soft-delete/:id",
  middlewareController.verifyTokenAdminAuth,
  softDelete
);
router.patch("/restore/:id", restore);
router.get("/deleted", deletedList);
router.get("/list", list);
router.get("/get-one/:id", getOne);
router.put(
  "/edit/:id",
  middlewareController.verifyTokenAdminAuth,
  upload.single("avatar"),
  update
);

module.exports = router;
