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
} = require("../../../controler/admin/authController");
const middlewareController = require("../../../middleware/auth");

router.post("/add", add);
router.delete("/delete/:id", hardDelete);
router.patch(
  "/soft-delete/:id",
  middlewareController.verifyTokenAdminAuth,
  softDelete
);
router.patch("/restore/:id", restore);
router.get("/deleted", deletedList);
router.get("/get-one/:id", getOne);
router.put("/edit/:id", middlewareController.verifyTokenAdminAuth, update);
module.exports = router;
