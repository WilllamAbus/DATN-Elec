const UserBidPrice = require('../../../../model/productAuction/userBidPrice');

module.exports = async (userId, auctionPricingRange, bidPrice) => {
  let userBidPrice = await UserBidPrice.findOne({ user: userId, auctionPricingRange: auctionPricingRange._id });

  if (!userBidPrice) {
    userBidPrice = new UserBidPrice({
      user: userId,
      bidPrice,
      auctionPricingRange: auctionPricingRange._id,
    });
  } else {
    userBidPrice.bidPrice = bidPrice;
    userBidPrice.updatedAt = new Date();
  }

  await userBidPrice.save();
  return userBidPrice;
};
