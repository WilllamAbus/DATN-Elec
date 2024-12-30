const getProductDetailAuction = require('./getProductDetailAuction').getProductDetailAuction;
const createOneUpdateBidAuction = require('./creatOneBidAuction').createOneUpdateBidAuction;
const getAuctionDetailsBySlug = require('./getAuctionDetailsBySlug').getAuctionDetailsBySlug;
const getAuctionPricingRange = require('./getAuctionPricingRange').getAuctionPricingRange;
const enterAuctionPrice = require('./enterAuctionPrice').enterAuctionPrice;
const biddingList  = require('./biddingList.controller').getBiddingList;
const processAuctionWinner = require('./biddingList.controller').processAuctionWinner;
const getUserBiddingHistory = require('./biddingList.controller').getUserBiddingHistory;
const getUserBiddingDetails = require('./biddingList.controller').getUserBiddingDetails;

module.exports = {
  getProductDetailAuction,
  createOneUpdateBidAuction,
  getAuctionDetailsBySlug,
  getAuctionPricingRange,
  biddingList,
  processAuctionWinner,
  getUserBiddingHistory, 
  getUserBiddingDetails,
  enterAuctionPrice
}