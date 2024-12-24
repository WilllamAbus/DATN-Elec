const express = require('express');
const router = express.Router();
const { getProductDetailAuction, createOneUpdateBidAuction,getAuctionDetailsBySlug } = require('../../../controler/client');
const middlewareController = require("../../../middleware/auth");

// Cập nhật router POST
router.post('/create-one-update-bid-auction/:slug', middlewareController.getHeader, createOneUpdateBidAuction);

router.get('/product-auction/:slug', middlewareController.getHeader, getProductDetailAuction);

router.get('/product-auction-win-and-lose/:slug', middlewareController.getHeader, getAuctionDetailsBySlug);

module.exports = router;
