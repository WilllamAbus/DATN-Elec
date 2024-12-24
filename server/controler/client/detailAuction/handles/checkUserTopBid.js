const UserBidPrice = require('../../../../model/productAuction/userBidPrice');

module.exports = async (userId, auctionPricingRange) => {
  const userBidPriceRecord = await UserBidPrice.findOne({ user: userId, auctionPricingRange: auctionPricingRange._id });
  if (userBidPriceRecord && userBidPriceRecord.bidPrice === auctionPricingRange.currentPrice) {
    return {
      success: false,
      err: 1,
      msg: 'Bạn đã đứng top với giá đấu này, không thể đặt lại giá.',
      status: 'error',
    };
  }
  return null;
};
