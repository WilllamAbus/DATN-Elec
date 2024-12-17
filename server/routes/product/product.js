const express = require("express");
const middlewareController = require("../../middleware/auth");
const router = express.Router();
const {
  addWatchlist,
  DeleteWatchlist,
  getWatchlist,
  CheckWatchlist,
} = require("../../controler/product/wathlist");
router.delete(
  "/delete/:variantId",
  middlewareController.verifyToken,
  DeleteWatchlist
);
router.post("/add/:variantId", middlewareController.verifyToken, addWatchlist);
router.get("/limit", middlewareController.verifyToken, getWatchlist);
router.get("/", middlewareController.verifyToken, CheckWatchlist);
module.exports = router;
