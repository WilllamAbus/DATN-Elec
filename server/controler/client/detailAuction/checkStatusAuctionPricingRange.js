const ProductAuction = require("../../../model/productAuction/productAuction");
const AuctionWinner = require("../../../model/productAuction/auctionWinner");
const AuctionRound = require("../../../model/productAuction/auctionRound");
const { getIO } = require('../../../services/skserver/socketServer');
const findUserName = require('./enter-handles/findUserName');

const checkStatusAuctionPricingRange = async (req, res) => {
const { slug } = req.params;
try {
  const productAuction = await ProductAuction.findOne({ slug }).populate('auctionPricing');
  if (!productAuction || !productAuction.auctionPricing) {
    return res.status(404).json({
      code: "NOT_FOUND",
      status: "error",
      message: "Sản phẩm hoặc thông tin đấu giá không tồn tại.",
      showModal: false
    });
  }

  const auctionRound = await AuctionRound.findOne({ auctionPricing: productAuction.auctionPricing })
    .populate('bids.user', 'name email');

  if (!auctionRound) {
    return res.status(404).json({
      code: "NO_ROUND",
      status: "error",
      message: "Không có vòng đấu giá.",
      showModal: false
    });
  }

  const auctionWinners = await AuctionWinner.find({
    auctionPricingRange: productAuction.auctionPricing,
    auctionStatus: 'temporary'
  })
    .populate("user", "name email")
    .sort({ bidPrice: -1 });

  if (auctionWinners.length === 0) {
    return res.status(404).json({
      code: "WINNER_NOT_FOUND",
      status: "error",
      message: "Không tìm thấy thông tin người trúng đấu giá.",
      showModal: false
    });
  }

  const winnersMap = new Map(auctionWinners.map((entry, index) => {
    const status = index === 0 ? "Đã trúng đấu giá. Bạn cần xác nhận thanh toán trong 5 phút." : "Vui lòng đợi trong 5 phút";
    const statusCode = index === 0 ? 4 : 5;
    return [entry.user._id.toString(), { user: entry.user, bidPrice: entry.bidPrice, status, statusCode }];
  }));

  const userName = await findUserName(auctionWinners[0].user);
  const result = auctionRound.bids.map(bid => {
    if (winnersMap.has(bid.user._id.toString())) {
      return winnersMap.get(bid.user._id.toString());
    } else {
      return {
        user: bid.user,
        bidPrice: bid.bidPrice,
        status: `Người dùng ${userName} đã đặt giá tối đa và cần xác nhận thanh toán trong 5 phút.`,
        statusCode: 5,
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
    message: "Thông tin trạng thái và người trúng đấu giá.",
    showModal: true,
    product: {
      name: productAuction.product_name,
      slug: productAuction.slug,
      currentPrice: productAuction.auctionPricing.currentPrice || 0,
      maxPrice: productAuction.auctionPricing.maxPrice || 0,
      auctionEndTime: productAuction.auctionPricing.endTime || null,
    },
    bidders: result,
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({
    code: "SERVER_ERROR",
    status: "error",
    message: "Lỗi server.",
    showModal: false
  });
}
};

module.exports = {
checkStatusAuctionPricingRange,
};
