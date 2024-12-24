const getProductDetailAuction = require('./getProductDetailAuction').getProductDetailAuction;
const createOneUpdateBidAuction = require('./creatOneBidAuction').createOneUpdateBidAuction;
const getAuctionDetailsBySlug = require('./getAuctionDetailsBySlug').getAuctionDetailsBySlug;
const biddingList  = require('./biddingList.controller').getBiddingList;
module.exports = {
  getProductDetailAuction,
  createOneUpdateBidAuction,
  getAuctionDetailsBySlug,
  biddingList
}