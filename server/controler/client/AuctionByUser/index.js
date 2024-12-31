const getAuctionWinsByUser = require('./getAuctionWinsByUser').getAuctionWinsByUser;
const confirmAuction = require('./confirmAuction').confirmAuction;
const canceledAuction = require('./canceledAuction').canceledAuction;
const getUserPendingAuctionWins = require('./getUserPendingAuctionWin').getUserPendingAuctionWins;
module.exports = {
  getAuctionWinsByUser,
  confirmAuction,
  canceledAuction,
  getUserPendingAuctionWins
}