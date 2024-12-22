const express = require("express");
const router = express.Router();

const autionController  = require("../../../controler/client/autions/autions.controller");
// const middlewareController = require("../../../middleware/auth");

router.get("/check-payment/:auctionId", autionController.checkPaymentStatus);
router.post("/confirm-payment/:auctionId", autionController.confirmPayment);




module.exports = router;