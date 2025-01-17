const ProductAuction = require("../../../model/productAuction/productAuction");
const AuctionPricingRange = require("../../../model/productAuction/auctionPricingRange");
const AuctionPriceHistory = require("../../../model/productAuction/auctionPriceHistory");
const AuctionWinner = require("../../../model/productAuction/auctionWinner");
const { getIO } = require('../../../services/skserver/socketServer');
const { sendEmailPending } = require('../../../services/sendEmailPending'); 
const { sendEmailWon } = require('../../../services/sendEmailWon'); 

const emailTwowinners = async (req, res) => {
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
      .limit(2)
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
      let statusCode;
      switch (index) {
        case 0:
          status = "topOne";
          statusCode = 100;
          break;
        case 1:
          status = "topTwo";
          statusCode = 200;
          break;
        default:
          status = "others";
          statusCode = 300;
      }

      return {
        user: bid.user,
        bidPrice: bid.bidPrice,
        bidTime: bid.bidTime,
        status,
        statusCode,
        emailSent: bid.emailSent,
      };
    });

    getIO().emit('topBiddersUpdate', {
      slug,
      topBidders: result,
    });

    const productDetails = `
      Tên sản phẩm: ${productAuction.product_name}
      Thời gian đấu giá: ${new Date(auctionPricingRange.startTime).toLocaleString()} - ${new Date(auctionPricingRange.endTime).toLocaleString()}
      <img src="${productAuction.image[0]}" alt="Product Image" style="max-width: 100%; height: auto;">
    `;

    const auctionTime = `${new Date(auctionPricingRange.startTime).toLocaleString()} - ${new Date(auctionPricingRange.endTime).toLocaleString()}`;
    const productImage = productAuction.image[0];

    // Kiểm tra và cập nhật emailSent trong bảng AuctionPricingRange
    if (!auctionPricingRange.emailSent) {
      auctionPricingRange.emailSent = true;
      await auctionPricingRange.save();
    }

    // Gửi email cho người thắng cuộc nếu email chưa được gửi
    if (!highestBids[0].emailSent) {
      await sendEmailWon(highestBids[0].user.email, 'Kết quả đấu giá', 'mailAuctionWon.ejs', {
        userName: highestBids[0].user.name,
        productName: productAuction.product_name,
        productDetails: productDetails,
        auctionTime: auctionTime,
        productImage: productImage,
        bidPrice: highestBids[0].bidPrice,
      });
      highestBids[0].emailSent = true;
      await highestBids[0].save();
    }

    // Gửi email cho người chờ nếu email chưa được gửi
    if (!highestBids[1].emailSent) {
      await sendEmailPending(highestBids[1].user.email, 'Kết quả đấu giá', 'mailAuctionPending.ejs', {
        userName: highestBids[1].user.name,
        productName: productAuction.product_name,
        productDetails: productDetails,
        auctionTime: auctionTime,
        productImage: productImage,
        bidPrice: highestBids[1].bidPrice,
      });
      highestBids[1].emailSent = true;
      await highestBids[1].save();
    }

    return res.status(200).json({
      code: "SUCCESS",
      status: "success",
      message: "Email đã được gửi đến 2 người đấu giá cao nhất.",
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
  emailTwowinners,
};
