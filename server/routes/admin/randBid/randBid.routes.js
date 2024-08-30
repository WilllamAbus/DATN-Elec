const express = require("express");
const router = express.Router();

const randBinController  = require("../../../controler/orders/auctions/rangBid.controller");
    




router.get('/create/:productId', randBinController.getRandBid);
router.post('/create/:productId', randBinController.postRandBid);
module.exports = router;