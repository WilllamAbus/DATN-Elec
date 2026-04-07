const ProductAuction = require("../../../model/productAuction/productAuction");
const AuctionPricingRange = require("../../../model/productAuction/auctionPricingRange");
const AuctionPriceHistory = require("../../../model/productAuction/auctionPriceHistory");
const { getIO } = require('../../../services/skserver/socketServer');

const getTop3HighestBidders = async (req, res) => {
  const { slug } = req.params;
  try {
    const productAuction = await ProductAuction.findOne({ slug });
    if (!productAuction) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: "error",
        message: "Sản phẩm không tồn tại.",
      });
    }

    const auctionPricingRange = await AuctionPricingRange.findOne({ _id: productAuction.auctionPricing });
    if (!auctionPricingRange) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: "error",
        message: "Không tìm thấy phiên đấu giá với slug này.",
      });
    }

    const highestBids = await AuctionPriceHistory.find({ auctionPricingRange: auctionPricingRange._id })
      .sort({ bidPrice: -1 })
      .limit(3)
      .populate('user', 'name email')
      .exec();

    if (!highestBids.length) {
      return res.status(404).json({
        code: "NO_BIDS",
        status: "error",
        message: "Không có đấu giá cho phiên này.",
      });
    }

    const result = highestBids.map((bid, index) => {
      let status;
      switch (index) {
        case 0 :
          status = "topOne";
          statusCode = 9;
          break;
        case 1:
          status = "topTwo";
          statusCode = 10;
          break;
        case 2:
          status = "topThree";
          statusCode = 11;
          break;
        default:
          status = "others";
          statusCode = 12;
      }

      return {
        user: bid.user,
        bidPrice: bid.bidPrice,
        bidTime: bid.bidTime,
        status,
        statusCode,
      };
    });

    getIO().emit('topBiddersUpdate', {
      slug,
      topBidders: result,
    });

    return res.status(200).json({
      code: "SUCCESS",
      status: "success",
      message: "Danh sách 3 người đấu giá cao nhất đã được tải thành công.",
      topBidders: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      status: "error",
      message: "Lỗi server.",
    });
  }
};

module.exports = {
  getTop3HighestBidders,
};
