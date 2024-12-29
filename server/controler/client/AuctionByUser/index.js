const getAuctionWinsByUser = require('./getAuctionWinsByUser').getAuctionWinsByUser;
const confirmAuction = require('./confirmAuction').confirmAuction;
const canceledAuction = require('./canceledAuction').canceledAuction;
module.exports = {
  getAuctionWinsByUser,
  confirmAuction,
  canceledAuction
}