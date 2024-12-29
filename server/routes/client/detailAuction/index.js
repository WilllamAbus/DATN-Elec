const express = require('express');
const router = express.Router();
const {
    getProductDetailAuction,
    createOneUpdateBidAuction,
    getAuctionDetailsBySlug,
    biddingList,
    processAuctionWinner,
    getUserBiddingHistory,
    getUserBiddingDetails
} = require('../../../controler/client');

const middlewareController = require("../../../middleware/auth");

// Cập nhật router POST
router.post('/create-one-update-bid-auction/:slug', middlewareController.getHeader, createOneUpdateBidAuction);

router.get('/product-auction/:slug', middlewareController.getHeader, getProductDetailAuction);

router.get('/product-auction-win-and-lose/:slug', middlewareController.getHeader, getAuctionDetailsBySlug);
router.get('/bidding-list/:slug', biddingList);
router.post("/process-winner/:slug", processAuctionWinner);

router.get('/user/bidding-history', middlewareController.getHeader, getUserBiddingHistory);
router.get('/user/bidding-details/:slug', middlewareController.getHeader, getUserBiddingDetails);

module.exports = router;
