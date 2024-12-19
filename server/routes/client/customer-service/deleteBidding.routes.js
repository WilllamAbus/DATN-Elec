// biddingRoutes.js
const express = require('express');
const router = express.Router();
const biddingController = require('../../../controler/orders/auctions/deleteBidding.controller');
const middlewareController = require("../../../middleware/auth");
// Định tuyến yêu cầu xóa đấu giá
router.post('/delete-bidd',middlewareController.verifyTokenUserAuth, biddingController.deleteBidAndCSController);

module.exports = router;