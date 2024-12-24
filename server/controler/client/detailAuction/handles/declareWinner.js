const AuctionPriceHistory = require('../../../../model/productAuction/auctionPriceHistory');
const AuctionWinner = require('../../../../model/productAuction/auctionWinner');

module.exports = async (auctionPricingRange, auctionRound) => {
  const winners = await AuctionPriceHistory.find({
    auctionPricingRange: auctionPricingRange._id,
  }).sort({ bidPrice: -1 }).limit(3);

  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    const auctionWinner = new AuctionWinner({
      user: winner.user,
      auctionPricingRange: auctionPricingRange._id,
      bidPrice: winner.bidPrice,
      bidTime: winner.bidTime,
      auctionRound: auctionRound._id,
      auctionStatus: i === 0 ? 'won' : 'pending',
    });
    await auctionWinner.save();
  }
};
