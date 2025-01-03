const AuctionRound = require('../../../../model/productAuction/auctionRound');

module.exports = async (userId, auctionPricingRange) => {
  const auctionRoundRecord = await AuctionRound.findOne({ auctionPricing: auctionPricingRange._id });
  const topBid = auctionRoundRecord && auctionRoundRecord.bids.find(bid => bid.bidPrice === auctionPricingRange.currentPrice && bid.user.toString() === userId.toString());
  if (topBid) {
    return {
      success: false,
      err: 1,
      msg: 'Bạn đã đứng top và không thể thay đổi giá đấu.',
      status: 'error',
    };
  }
  return null;
};
