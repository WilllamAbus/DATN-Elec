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
}