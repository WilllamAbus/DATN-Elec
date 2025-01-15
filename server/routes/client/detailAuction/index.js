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
    enterAuctionPrice,
    checkAuctionTime,
    checkStatusAuctionPricingRange,
    highBidderInformation,
    getAuctionProgress,
    getTop3HighestBidders,
    getUserCart,
    checkAuctionTimeAuctionPricingRange,
    emailTwowinners
} = require('../../../controler/client');

const middlewareController = require("../../../middleware/auth");
const { verifyAuctionEligibility } = require("../../../middleware/verifyAuctionEligibility");
router.post('/create-one-update-bid-auction/:slug', middlewareController.getHeader,verifyAuctionEligibility, createOneUpdateBidAuction);
router.post('/enter-one-update-bid-auction/:slug', middlewareController.getHeader, enterAuctionPrice);
router.get('/product-auction/:slug', middlewareController.getHeader, getProductDetailAuction);
router.get('/check-auction-time/:slug', middlewareController.getHeader, checkAuctionTime);
router.get('/check-status-auction-pricing-range/:slug',checkStatusAuctionPricingRange);
router.get('/high-bidder-information/:slug',highBidderInformation);
router.get('/product-auction-win-and-lose/:slug', middlewareController.getHeader, getAuctionDetailsBySlug);
router.get('/auction-progress/:slug', getAuctionProgress);
router.get('/bidding-list/:slug', getBiddingListAndWinner);
router.get('/product-auction-check-current-price/:slug', middlewareController.getHeader, getAuctionPricingRange);
router.get('/top-3-highest-bidder/:slug', getTop3HighestBidders);
router.get('/user/bidding-history', middlewareController.getHeader, getUserBiddingHistory);
router.get('/user/bidding-details/:slug', middlewareController.getHeader, getUserBiddingDetails);
router.get('/check-list-cart', middlewareController.getHeader,getUserCart);
router.get('/check-auctio-time-auction-pricing-range/:slug', middlewareController.getHeader,checkAuctionTimeAuctionPricingRange);
router.get('/email-two-winner/:slug', middlewareController.getHeader,emailTwowinners);
module.exports = router;
