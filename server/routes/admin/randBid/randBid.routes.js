const express = require("express");
const router = express.Router();

const randBinController  = require("../../../controler/orders/auctions/rangBid.controller");
const middlewareController = require("../../../middleware/auth");




router.get('/getRandBid/:productId', randBinController.getRandBid);
router.post('/create',middlewareController.verifyToken, randBinController.postRandBid);
module.exports = router;