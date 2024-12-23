const express = require("express");
const router = express.Router();

const biddingController  = require("../../../controler/client/autions/biddingList.controller");
const middlewareController = require("../../../middleware/auth");

router.post("/placeBid", middlewareController.verifyToken, biddingController.placeBid);
router.get("/bidding-list/:auctionPricingRangeId", biddingController.getBiddingList);
router.post("/handle-payment-result", middlewareController.verifyToken, biddingController.handlePaymentResult);


module.exports = router;