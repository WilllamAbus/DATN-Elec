const AuctionPriceHistory = require('../../../../model/productAuction/auctionPriceHistory');
const AuctionWinner = require('../../../../model/productAuction/auctionWinner');
const { convertToLocalTime } = require('../../../../utils/timeConverter');

module.exports = async (auctionPricingRange, auctionRound) => {
  const winners = await AuctionPriceHistory.find({
    auctionPricingRange: auctionPricingRange._id,
  }).sort({ bidPrice: -1 }).limit(2);

  const currentTime = new Date();

  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    const auctionWinner = new AuctionWinner({
      user: winner.user,
      auctionPricingRange: auctionPricingRange._id,
      bidPrice: winner.bidPrice,
      bidTime: winner.bidTime,
      auctionRound: auctionRound._id,
      auctionStatus: i === 0 ? 'won' : 'pending',
      startTime: convertToLocalTime(currentTime),
      endTime: convertToLocalTime(new Date(currentTime.getTime() + (i === 0 ? 3 : 5) * 24 * 60 * 60 * 1000)), 
    });
    await auctionWinner.save();
  }
};
