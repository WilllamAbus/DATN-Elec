const getAuctionWinsByUser = require('./getAuctionWinsByUser').getAuctionWinsByUser;
const confirmAuction = require('./confirmAuction').confirmAuction;
const canceledAuction = require('./canceledAuction').canceledAuction;
const getUserPendingAuctionWins = require('./getUserPendingAuctionWin').getUserPendingAuctionWins;
const canceledAuctionTemporary = require('./canceledAuctionTemporary').canceledAuctionTemporary;
const confirmAuctionTemporary = require('./confirmAuctionTemporary').confirmAuctionTemporary;
module.exports = {
  getAuctionWinsByUser,
  confirmAuction,
  canceledAuction,
  getUserPendingAuctionWins,
  canceledAuctionTemporary,
  confirmAuctionTemporary
}