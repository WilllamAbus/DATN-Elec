const UserAuctionHistory = require('../../../../model/productAuction/userAuctionHistory');

module.exports = async (userId, auctionRound, bidPrice) => {
  let userAuctionHistory = await UserAuctionHistory.findOne({ user: userId });

  if (!userAuctionHistory) {
    userAuctionHistory = new UserAuctionHistory({
      user: userId,
      bids: [{
        auctionRound: auctionRound._id,
        bidPrice,
        bidTime: new Date(),
      }],
    });
  } else {
    userAuctionHistory.bids.push({
      auctionRound: auctionRound._id,
      bidPrice,
      bidTime: new Date(),
    });
  }

  await userAuctionHistory.save();
  return userAuctionHistory;
};
