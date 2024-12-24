const AuctionPriceHistory = require('../../../../model/productAuction/auctionPriceHistory');

module.exports = async (auctionPricingRange, auctionRound, userId, bidPrice) => {
  let auctionPriceHistory = await AuctionPriceHistory.findOne({
    auctionPricingRange: auctionPricingRange._id,
    user: userId,
  });

  if (!auctionPriceHistory) {
    auctionPriceHistory = new AuctionPriceHistory({
      auctionPricingRange: auctionPricingRange._id,
      auctionRound: auctionRound._id,
      user: userId,
      bidPrice,
      bidTime: new Date(),
    });
  } else {
    auctionPriceHistory.bidPrice = bidPrice;
    auctionPriceHistory.bidTime = new Date();
  }

  await auctionPriceHistory.save();
  return auctionPriceHistory;
};
