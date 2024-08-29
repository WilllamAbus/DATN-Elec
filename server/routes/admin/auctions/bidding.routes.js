const express = require("express");
const router = express.Router();

const biddingController  = require("../../../controler/orders/auctions/bidding.controller");
    




router.post('/createBiding/:productId', biddingController.createBid);
module.exports = router;