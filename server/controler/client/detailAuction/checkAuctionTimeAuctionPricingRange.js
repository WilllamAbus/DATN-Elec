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
        code: 'PHIEN_DAU_GIA_KHONG TIM THAY',
        msg: 'Phiên đấu giá không tồn tại',
        status: 404,
        statusOutOfTimeAuctionPricingRange: false,
        statusCheckAuctionTimeAuctionPricingRange: 0
      });
    }

    const currentTime = new Date().getTime();
    const endTime = new Date(auctionPricingRange.endTime).getTime();

    // Kiểm tra trạng thái tạm thời và cập nhật nếu có
    if (auctionPricingRange.status === 'temporary') {
      if (
        auctionPricingRange.currentPriceTemporarily == null ||
        auctionPricingRange.startTimeTemporarily == null ||
        auctionPricingRange.endTimeTemporarily == null ||
        auctionPricingRange.remainingTimeTemporarily == null
      ) {
        const io = getIO();
        io.emit('auctionStatusTemporary', {
          slug,
          status: 'temporary',
          message: 'Phiên đấu giá tạm thời cần cập nhật'
        });
      } else {
        auctionPricingRange.currentPrice = auctionPricingRange.currentPriceTemporarily;
        auctionPricingRange.startTime = auctionPricingRange.startTimeTemporarily;
        auctionPricingRange.endTime = auctionPricingRange.endTimeTemporarily;
        auctionPricingRange.remainingTime = auctionPricingRange.remainingTimeTemporarily;
        auctionPricingRange.status = 'temporary';
        auctionPricingRange.currentPriceTemporarily = null;
        auctionPricingRange.startTimeTemporarily = null;
        auctionPricingRange.endTimeTemporarily = null;
        auctionPricingRange.remainingTimeTemporarily = null;
        await auctionPricingRange.save();
      }
    }

    // Kiểm tra trạng thái kết thúc và có người thắng
    if (auctionPricingRange.status === 'ended') {
      const io = getIO();

      if (auctionPricingRange.hasWinner) {
        io.emit('auctionStatusHasWinner', {
          slug,
          status: 'endedWithWinner',
          message: 'Phiên đấu giá đã kết thúc và có người thắng'
        });

        return res.status(200).json({
          success: true,
          code: 'DAU_GIA_KET_THUC_VA_CO_NGUOI_THANG',
          msg: 'Phiên đấu giá đã kết thúc và đã có người thắng',
          status: 200,
          statusOutOfTimeAuctionPricingRange: true,
          statusCheckAuctionTimeAuctionPricingRange: 1,
          auctionPricing: {
            hasWinner: auctionPricingRange.hasWinner,
            status: auctionPricingRange.status
          }
        });
      } else {
        io.emit('auctionStatusNoWinner', {
          slug,
          status: 'endedNoWinner',
          message: 'Phiên đấu giá đã kết thúc nhưng không có người thắng'
        });

        return res.status(200).json({
          success: true,
          code: 'DAU_GIA_KET_THUC_KHONG_CO_NGUOI_THANG',
          msg: 'Phiên đấu giá đã kết thúc nhưng không có người thắng',
          status: 200,
          statusOutOfTimeAuctionPricingRange: true,
          statusCheckAuctionTimeAuctionPricingRange: 1,
          auctionPricing: {
            hasWinner: auctionPricingRange.hasWinner,
            status: auctionPricingRange.status
          }
        });
      }
    }

    // Kiểm tra trạng thái kết thúc nhưng chưa cập nhật
    if (currentTime >= endTime) {
      if (auctionPricingRange.status === 'active') {
        auctionPricingRange.status = 'ended';
        auctionPricingRange.remainingTime = "Đã kết thúc";
        await auctionPricingRange.save();

        const io = getIO();
        io.emit('auctionStatusOutOfTime', {
          slug,
          status: 'outOfTime',
          message: 'Đấu giá đã kết thúc'
        });

        if (auctionPricingRange.hasWinner) {
          io.emit('auctionStatusHasWinner', {
            slug,
            status: 'endedWithWinner',
            message: 'Phiên đấu giá đã kết thúc và có người thắng'
          });

          return res.status(200).json({
            success: true,
            code: 'DAU_GIA_KET THUC VA CO NGUOI THANG',
            msg: 'Phiên đấu giá đã kết thúc và đã có người thắng',
            status: 200,
            statusOutOfTimeAuctionPricingRange: true,
            statusCheckAuctionTimeAuctionPricingRange: 1,
            auctionPricing: {
              hasWinner: auctionPricingRange.hasWinner,
              status: auctionPricingRange.status
            }
          });
        }

        return res.status(200).json({
          success: true,
          code: 'DAU_GIA_KET_THUC',
          msg: 'Đấu giá đã kết thúc',
          status: 200,
          statusOutOfTimeAuctionPricingRange: true,
          statusCheckAuctionTimeAuctionPricingRange: 1,
          auctionPricing: {
            hasWinner: auctionPricingRange.hasWinner,
            status: auctionPricingRange.status
          }
        });
      } else if (auctionPricingRange.status === 'paid') {
        const io = getIO();
        io.emit('auctionStatusPaid', {
          slug,
          status: 'paid',
          message: 'Đấu giá đã kết thúc và đã thanh toán'
        });

        return res.status(200).json({
          success: true,
          code: 'DAU_GIA_KET_THUC_DA_THANH_TOAN',
          msg: 'Đấu giá đã kết thúc và đã thanh toán',
          status: 200,
          statusOutOfTimeAuctionPricingRange: true,
          statusCheckAuctionTimeAuctionPricingRange: 1,
          auctionPricing: {
            hasWinner: auctionPricingRange.hasWinner,
            status: auctionPricingRange.status
          }
        });
      }
    } else {
      const remainingTimeMs = endTime - currentTime;
      const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

      const remainingTime = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;

      const io = getIO();
      io.emit('auctionStatusInProgress', {
        slug,
        status: 'inProgress',
        message: 'Đấu giá vẫn đang diễn ra'
      });

      return res.status(200).json({
        success: true,
        code: 'DAU_GIA_DANG_DIEN_RA',
        msg: 'Đấu giá vẫn đang diễn ra',
        status: 200,
        remainingTime,
        statusOutOfTimeAuctionPricingRange: false,
        statusCheckAuctionTimeAuctionPricingRange: 2,
        auctionPricing: {
          hasWinner: auctionPricingRange.hasWinner,
          status: auctionPricingRange.status
        }
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

