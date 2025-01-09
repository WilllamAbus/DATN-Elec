const Product = require('../../../model/productAuction/productAuction');
const { getIO } = require('../../../services/skserver/socketServer');

const checkAuctionTimeAuctionPricingRange = async (req, res) => {
  const { slug } = req.params;

  try {

    const product = await Product.findOne({ slug }).populate('auctionPricing');
    if (!product) {
      return res.status(404).json({
        success: false,
        code: 'KHONG_TIM_THAY_DAU_GIA',
        msg: 'Không tìm thấy phiên đấu giá',
        status: 404,
        statusOutOfTimeAuctionPricingRange: false,
        statusCheckAuctionTimeAuctionPricingRange: 0
      });
    }

    const auctionPricingRange = product.auctionPricing;
    if (!auctionPricingRange) {
      return res.status(404).json({
        success: false,
        code: 'PHIEN_DAU_GIA_KHONG_TIM_THAY',
        msg: 'Phiên đấu giá không tồn tại',
        status: 404,
        statusOutOfTimeAuctionPricingRange: false,
        statusCheckAuctionTimeAuctionPricingRange: 0
      });
    }


    if (auctionPricingRange.status !== 'active') {
      return res.status(200).json({
        success: false,
        code: 'PHIEN_DAU_GIA_KHONG_CON_HOAT_DONG',
        msg: 'Phiên đấu giá không còn hoạt động',
        status: 404,
        statusOutOfTimeAuctionPricingRange: false,
        statusCheckAuctionTimeAuctionPricingRange: 0
      });
    }

    const currentTime = new Date().getTime();
    const endTime = new Date(auctionPricingRange.endTime).getTime();

    // Kiểm tra nếu thời gian đấu giá đã kết thúc
    if (currentTime >= endTime) {
      // Phát sự kiện qua socket server
      const io = getIO();
      io.emit('auctionStatusOutOfTime', {
        slug,
        status: 'outOfTime',
        message: 'Đấu giá đã kết thúc'
      });

      return res.status(200).json({
        success: true,
        code: 'DAU_GIA_KET_THUC',
        msg: 'Đấu giá đã kết thúc',
        status: 200,
        statusOutOfTimeAuctionPricingRange: true,
        statusCheckAuctionTimeAuctionPricingRange: 1
      });
    } else {
      // Tính toán thời gian còn lại
      const remainingTimeMs = endTime - currentTime;
      const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTimeMs % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

      const remainingTime = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;

      return res.status(200).json({
        success: true,
        code: 'DAU_GIA_DANG_DIEN_RA',
        msg: 'Đấu giá vẫn đang diễn ra',
        status: 200,
        remainingTime,
        statusOutOfTimeAuctionPricingRange: false,
        statusCheckAuctionTimeAuctionPricingRange: 2
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      msg: 'Lỗi máy chủ. Vui lòng thử lại sau.',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = { checkAuctionTimeAuctionPricingRange };
