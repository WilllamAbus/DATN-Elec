const AuctionPricingRange = require("../../../../model/productAuction/auctionPricingRange");

const checkAuctionPricingRange = async (auctionPricingId) => {
  try {
    const auctionPricingRange = await AuctionPricingRange.findOne({ _id: auctionPricingId });
    if (!auctionPricingRange) {
      throw {
        status: 404,
        code: "NOT_FOUND",
        message: "Auction Pricing Range not found.",
      };
    }
    return auctionPricingRange;
  } catch (error) {
    throw {
      status: 500,
      code: error.code || "SERVER_ERROR",
      message: error.message || "An error occurred while fetching the auction pricing range.",
    };
  }
};

module.exports = checkAuctionPricingRange;
