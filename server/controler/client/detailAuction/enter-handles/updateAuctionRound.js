const AuctionRound = require('../../../../model/productAuction/auctionRound');

module.exports = async (auctionPricingRange, userId, bidPrice) => {
  let auctionRound = await AuctionRound.findOne({ auctionPricing: auctionPricingRange._id });

  if (!auctionRound) {
    auctionRound = new AuctionRound({
      auctionPricing: auctionPricingRange._id,
      participants: [userId],
      bids: [{ user: userId, bidPrice, bidTime: new Date() }],
    });
  } else {
    if (!auctionRound.participants.includes(userId)) {
      auctionRound.participants.push(userId);
    }
    const existingBid = auctionRound.bids.find(bid => bid.user.toString() === userId.toString());
    if (existingBid) {
      existingBid.bidPrice = bidPrice;
      existingBid.bidTime = new Date();
    } else {
      auctionRound.bids.push({ user: userId, bidPrice, bidTime: new Date() });
    }
    auctionRound.updatedAt = new Date();
  }

  await auctionRound.save();
  return auctionRound;
};
