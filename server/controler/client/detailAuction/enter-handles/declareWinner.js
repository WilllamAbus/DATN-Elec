const AuctionPriceHistory = require('../../../../model/productAuction/auctionPriceHistory');
const AuctionWinner = require('../../../../model/productAuction/auctionWinner');
const { convertToLocalTime } = require('../../../../utils/timeConverter');

module.exports = async (auctionPricingRange, auctionRound) => {
  const winner = await AuctionPriceHistory.findOne({
    auctionPricingRange: auctionPricingRange._id,
    bidPrice: auctionPricingRange.maxPrice,
  }).sort({ bidPrice: -1 });

  const currentTime = new Date();
  const temporaryEndTime = new Date(currentTime.getTime() + 1 * 60 * 1000); // 5 phút sau

  if (winner) {
    const auctionWinner = new AuctionWinner({
      user: winner.user,
      auctionPricingRange: auctionPricingRange._id,
      bidPrice: winner.bidPrice,
      bidTime: winner.bidTime,
      auctionRound: auctionRound._id,
      auctionStatus: 'temporary',
      startTime: convertToLocalTime(currentTime),
      endTime: convertToLocalTime(temporaryEndTime),
    });
    await auctionWinner.save();

    // Thay đổi trạng thái đấu giá thành temporary
    auctionPricingRange.status = 'temporary';
    await auctionPricingRange.save();
  }
};
