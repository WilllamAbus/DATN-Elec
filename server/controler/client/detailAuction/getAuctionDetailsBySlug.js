const ProductAuction = require("../../../model/productAuction/productAuction");
const AuctionWinner = require("../../../model/productAuction/auctionWinner");
const AuctionRound = require("../../../model/productAuction/auctionRound");
const AuctionPricingRange = require("../../../model/productAuction/auctionPricingRange");
const { getIO } = require('../../../services/skserver/socketServer');
const { sendEmailPending } = require('../../../services/sendEmailPending');
const { sendEmailWon } = require('../../../services/sendEmailWon');

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

    const auctionPricingRange = await AuctionPricingRange.findOne({ _id: productAuction.auctionPricing });
    if (!auctionPricingRange) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: "error",
        message: "Không tìm thấy phiên đấu giá với slug này.",
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

    const productDetails = `
      Tên sản phẩm: ${productAuction.product_name}
      Thời gian đấu giá: ${new Date(auctionPricingRange.startTime).toLocaleString()} - ${new Date(auctionPricingRange.endTime).toLocaleString()}
      <img src="${productAuction.image[0]}" alt="Product Image" style="max-width: 100%; height: auto;">
    `;
    const auctionTime = `${new Date(auctionPricingRange.startTime).toLocaleString()} - ${new Date(auctionPricingRange.endTime).toLocaleString()}`;
    const productImage = productAuction.image[0];

    for (const entry of auctionWinners) {
      if (!entry.emailSent) {
        const emailTemplate = entry.statusCode === 0 ? 'mailAuctionWon.ejs' : 'mailAuctionPending.ejs';
        const sendEmail = entry.statusCode === 0 ? sendEmailWon : sendEmailPending;
        await sendEmail(entry.user.email, 'Kết quả đấu giá', emailTemplate, {
          userName: entry.user.name,
          productName: productAuction.product_name,
          productDetails: productDetails,
          auctionTime: auctionTime,
          productImage: productImage,
          bidPrice: entry.bidPrice,
        });
        entry.emailSent = true;
        await entry.save();
      }
    }

    return res.status(200).json({
      code: "SUCCESS",
      status: "success",
      message: "Danh sách người đấu giá đã được tải thành công và email đã được gửi.",
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
