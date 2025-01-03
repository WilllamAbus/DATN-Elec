const express = require('express');
const router = express.Router();
const {
    getProductDetailAuction,
    createOneUpdateBidAuction,
    getAuctionDetailsBySlug,
    getBiddingListAndWinner,
    getAuctionPricingRange,
    getUserBiddingHistory,
    getUserBiddingDetails,
    enterAuctionPrice
} = require('../../../controler/client');

const middlewareController = require("../../../middleware/auth");

router.post('/create-one-update-bid-auction/:slug', middlewareController.getHeader, createOneUpdateBidAuction);
router.post('/enter-one-update-bid-auction/:slug', middlewareController.getHeader, enterAuctionPrice);
router.get('/product-auction/:slug', middlewareController.getHeader, getProductDetailAuction);

router.get('/product-auction-win-and-lose/:slug', middlewareController.getHeader, getAuctionDetailsBySlug);
router.get('/bidding-list/:slug', getBiddingListAndWinner);
router.get('/product-auction-check-current-price/:slug', middlewareController.getHeader, getAuctionPricingRange);

router.get('/user/bidding-history', middlewareController.getHeader, getUserBiddingHistory);
router.get('/user/bidding-details/:slug', middlewareController.getHeader, getUserBiddingDetails);

module.exports = router;
