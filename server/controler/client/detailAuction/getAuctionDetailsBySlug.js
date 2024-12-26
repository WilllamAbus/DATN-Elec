const ProductAuction = require("../../../model/productAuction/productAuction");
const AuctionWinner = require("../../../model/productAuction/auctionWinner");
const { getIO } = require('../../../services/skserver/socketServer');

const getAuctionDetailsBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    // Find the product auction by slug
    const productAuction = await ProductAuction.findOne({ slug });
    if (!productAuction) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: "error",
        message: "Sản phẩm không tồn tại.",
      });
    }

    // Find the auction winners for the auctionPricingRange associated with the product
    const auctionWinners = await AuctionWinner.find({
      auctionPricingRange: productAuction.auctionPricing,
    })
      .populate("user", "name email")
      .sort({ bidPrice: -1 });

    if (auctionWinners.length === 0) {
      return res.status(404).json({
        code: "NO_HISTORY",
        status: "error",
        message: "Không có lịch sử đấu giá.",
      });
    }

    // Map auction winners to include status
    const result = auctionWinners.map((entry, index) => {
      if (index === 0) {
        return {
          user: entry.user,
          bidPrice: entry.bidPrice,
          status: "Đã trúng đấu giá",
          statusCode: 0,
        };
      } else if (index < 3) {
        return {
          user: entry.user,
          bidPrice: entry.bidPrice,
          status: "Đang trong danh sách hàng chờ",
          statusCode: 1,
        };
      } else {
        return {
          user: entry.user,
          bidPrice: entry.bidPrice,
          status: "Không trúng đấu, chúc bạn may mắn lần sau",
          statusCode: 2,
        };
      }
    });

    // Emit socket event to update clients
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
