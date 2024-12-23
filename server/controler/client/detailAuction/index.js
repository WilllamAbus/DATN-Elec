const getProductDetailAuction = require('./getProductDetailAuction').getProductDetailAuction;
const createOneUpdateBidAuction = require('./creatOneBidAuction').createOneUpdateBidAuction;
const biddingList  = require('./biddingList.controller').getBiddingList;
module.exports = {
  getProductDetailAuction,
  createOneUpdateBidAuction,
  biddingList
}