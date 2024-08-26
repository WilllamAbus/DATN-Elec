const express = require("express");
const middlewareController = require("../../middleware/auth");
const router = express.Router();
const {
  addWatchlist,
  DeleteWatchlist,
  getWatchlist,
} = require("../../controler/product/wathlist");
router.delete("/delete/:id", middlewareController.verifyToken, DeleteWatchlist);
router.post("/add", middlewareController.verifyToken, addWatchlist);
router.get("/", middlewareController.verifyToken, getWatchlist);
module.exports = router;
