const getProductDetailAuction = require('./getProductDetailAuction').getProductDetailAuction;
const createOneUpdateBidAuction = require('./creatOneBidAuction').createOneUpdateBidAuction;
const getAuctionDetailsBySlug = require('./getAuctionDetailsBySlug').getAuctionDetailsBySlug;
const getBiddingListAndWinner  = require('./biddingList.controller').getBiddingListAndWinner;
const getAuctionPricingRange = require('./getAuctionPricingRange').getAuctionPricingRange;
const enterAuctionPrice = require('./enterAuctionPrice').enterAuctionPrice;
const getUserBiddingHistory = require('./biddingList.controller').getUserBiddingHistory;
const getUserBiddingDetails = require('./biddingList.controller').getUserBiddingDetails;
const checkAuctionTime = require('./checkAuctionTime').checkAuctionTime;
const checkStatusAuctionPricingRange = require('./checkStatusAuctionPricingRange').checkStatusAuctionPricingRange;
const highBidderInformation = require('./highBidderInformation').highBidderInformation;
const getAuctionProgress = require('./auctionProgress').getAuctionProgress;
const getTop3HighestBidders = require('./getTop3HighestBidders').getTop3HighestBidders;
const getUserCart = require('./getUserCart').getUserCart;
const checkAuctionTimeAuctionPricingRange = require('./checkAuctionTimeAuctionPricingRange').checkAuctionTimeAuctionPricingRange;
const emailTwowinners = require('./emailTwowinners').emailTwowinners;
module.exports = {
  getProductDetailAuction,
  createOneUpdateBidAuction,
  getAuctionDetailsBySlug,
  getUserBiddingHistory, 
  getUserBiddingDetails,
  enterAuctionPrice,
  checkAuctionTime,
  checkStatusAuctionPricingRange,
  highBidderInformation,
  getBiddingListAndWinner,
  getAuctionPricingRange,
  getAuctionProgress,
  getTop3HighestBidders,
  getUserCart,
  checkAuctionTimeAuctionPricingRange,
  emailTwowinners
}