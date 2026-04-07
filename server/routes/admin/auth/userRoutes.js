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
  listRole,
  getUseLimit,
  getdisableLimit,
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
router.get("/listRole", middlewareController.verifyTokenAdminAuth, listRole);
router.get("/get-one/:id", getOne);
router.get("/limit/", middlewareController.verifyTokenAdminAuth, getUseLimit);
router.get(
  "/disable/limit/",
  middlewareController.verifyTokenAdminAuth,
  getdisableLimit
);
router.put(
  "/edit/:id",
  middlewareController.verifyTokenAdminAuth,
  upload.single("avatar"),
  update
);

module.exports = router;
