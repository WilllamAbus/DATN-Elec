const AuctionRound = require("../../../../model/productAuction/auctionRound");

const checkAuctionRound = async (auctionPricing) => {
  const auctionRound = await AuctionRound.findOne({ auctionPricing }).populate('bids.user', 'name email');
  if (!auctionRound) {
    throw {
      status: 404,
      code: "NOT_FOUND",
      message: "Không tìm thấy phiên đấu giá."
    };
  }
  return auctionRound;
};

module.exports = checkAuctionRound;
