const AuctionWinner = require("../../../../model/productAuction/auctionWinner");
const AuctionPriceHistory = require("../../../../model/productAuction/auctionPriceHistory");

const handleAuctionWinner = async (auctionPricingRange, auctionRound, productAuction) => {
  const topBids = await AuctionPriceHistory.find({ auctionPricingRange: productAuction.auctionPricing })
    .sort({ bidPrice: -1 })
    .limit(2);

  if (topBids.length === 0) {
    return {
      status: "NO_BIDS",
      message: "Đấu giá đã kết thúc nhưng không có giá đấu nào.",
      case: 1,
    };
  }

  for (let i = 0; i < topBids.length; i++) {
    const bid = topBids[i];
    const auctionWinner = new AuctionWinner({
      user: bid.user,
      auctionPricingRange: auctionPricingRange._id,
      bidPrice: bid.bidPrice,
      bidTime: bid.bidTime,
      auctionRound: auctionRound._id,
      auctionStatus: i === 0 ? 'won' : 'pending',
      hasWinner: true,
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + (i === 0 ? 3 : 5) * 24 * 60 * 60 * 1000),
    });
    await auctionWinner.save();
  }

  auctionPricingRange.hasWinner = true;
  await auctionPricingRange.save();

  return {
    status: "AUCTION_ENDED_WITH_WINNERS",
    message: "Phiên đấu giá đã kết thúc và cập nhật người thắng thành công.",
    case: 2,
  };
};

module.exports = handleAuctionWinner;
