const getProductDetailAuction = require('./getProductDetailAuction').getProductDetailAuction;
const createOneUpdateBidAuction = require('./creatOneBidAuction').createOneUpdateBidAuction;
const getAuctionDetailsBySlug = require('./getAuctionDetailsBySlug').getAuctionDetailsBySlug;
const getBiddingListAndWinner  = require('./biddingList.controller').getBiddingListAndWinner;
const getAuctionPricingRange = require('./getAuctionPricingRange').getAuctionPricingRange;
const enterAuctionPrice = require('./enterAuctionPrice').enterAuctionPrice;
const getUserBiddingHistory = require('./biddingList.controller').getUserBiddingHistory;
const getUserBiddingDetails = require('./biddingList.controller').getUserBiddingDetails;

module.exports = {
  getProductDetailAuction,
  createOneUpdateBidAuction,
  getAuctionDetailsBySlug,
  getUserBiddingHistory, 
  getUserBiddingDetails,
  getBiddingListAndWinner,
  getAuctionPricingRange,
  enterAuctionPrice
}