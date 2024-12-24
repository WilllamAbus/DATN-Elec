const express = require('express');
const router = express.Router();
const { getProductDetailAuction, createOneUpdateBidAuction,getAuctionDetailsBySlug,biddingList } = require('../../../controler/client');

const middlewareController = require("../../../middleware/auth");

// Cập nhật router POST
router.post('/create-one-update-bid-auction/:slug', middlewareController.getHeader, createOneUpdateBidAuction);

router.get('/product-auction/:slug', middlewareController.getHeader, getProductDetailAuction);

router.get('/product-auction-win-and-lose/:slug', middlewareController.getHeader, getAuctionDetailsBySlug);
router.get('/bidding-list/:slug', biddingList )

module.exports = router;
