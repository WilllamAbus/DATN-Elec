const ProductAuction = require("../../../model/productAuction/productAuction");
const AuctionWinner = require("../../../model/productAuction/auctionWinner");
const AuctionRound = require("../../../model/productAuction/auctionRound");
const { getIO } = require('../../../services/skserver/socketServer');

const getAuctionDetailsBySlug = async (req, res) => {
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
    const auctionRound = await AuctionRound.findOne({ auctionPricing: productAuction.auctionPricing })
      .populate('bids.user', 'name email');

    if (!auctionRound) {
      return res.status(404).json({
        code: "NO_ROUND",
        status: "error",
        message: "Không có vòng đấu giá.",
      });
    }
    const auctionWinners = await AuctionWinner.find({
      auctionPricingRange: productAuction.auctionPricing,
      status: { $ne: 'disabled' } 
    })
      .populate("user", "name email")
      .sort({ bidPrice: -1 });
    const winnersMap = new Map(auctionWinners.map((entry, index) => {
      const status = index === 0 ? "Đã trúng đấu giá" : "Đang trong danh sách hàng chờ";
      const statusCode = index === 0 ? 0 : 1;
      return [entry.user._id.toString(), { user: entry.user, bidPrice: entry.bidPrice, status, statusCode }];
    }));
    const result = auctionRound.bids.map(bid => {
      if (winnersMap.has(bid.user._id.toString())) {
        return winnersMap.get(bid.user._id.toString());
      } else {
        return {
          user: bid.user,
          bidPrice: bid.bidPrice,
          status: "Không trúng đấu, chúc bạn may mắn lần sau",
          statusCode: 2,
        };
      }
    });
    getIO().emit('auctionUpdate', {
      slug,
      bidders: result,
      product: {
        name: productAuction.product_name,
        slug: productAuction.slug,
      },
    });

    return res.status(200).json({
      code: "SUCCESS",
      status: "success",
      message: "Danh sách người đấu giá đã được tải thành công.",
      product: {
        name: productAuction.product_name,
        slug: productAuction.slug,
      },
      bidders: result,
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
  getAuctionDetailsBySlug,
};
