module.exports = async (auctionPricingRange, bidPrice) => {
  auctionPricingRange.currentPrice = bidPrice;
  auctionPricingRange.updatedAt = new Date();
  await auctionPricingRange.save();
};
