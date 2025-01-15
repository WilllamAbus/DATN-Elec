const ProductAuction = require('../../model/productAuction/productAuction');
const AuctionPricingRange = require('../../model/productAuction/auctionPricingRange');
const AuctionPriceHistory = require('../../model/productAuction/auctionPriceHistory');
const AuctionWinner = require('../../model/productAuction/auctionWinner');

const AuctionService = {
  checkAuctionTime: async (slug) => {
    const productAuction = await ProductAuction.findOne({ slug }).populate('auctionPricing');
    if (!productAuction) {
      return {
        success: false,
        code: 'KHONG_TIM_THAY_SAN_PHAM',
        msg: 'Không tìm thấy sản phẩm đấu giá',
        status: 404,
        statusOutOfTime: false,
        statuscheckAuctionTime: 0
        
      };
    }

    const auctionPricingRange = productAuction.auctionPricing;
    const currentTime = new Date().getTime();
    const endTime = new Date(auctionPricingRange.endTime).getTime();

    if (auctionPricingRange.status === 'ended') {
      return {
        success: true,
        code: 'DAU_GIA_DA_KET_THUC',
        msg: 'Sản phẩm đấu giá này đã kết thúc',
        status: 200,
        statusOutOfTime: true,
        statuscheckAuctionTime: 1
      };
    }


    const remainingTimeMs = endTime - currentTime;
    const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

    auctionPricingRange.remainingTime = remainingTimeMs > 0 
      ? `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây` 
      : "Đã kết thúc";

    await auctionPricingRange.save();

    if (currentTime >= endTime) {
      // Tìm người đấu giá cao nhất từ bảng AuctionPriceHistory
      const winners = await AuctionPriceHistory.find({
        auctionPricingRange: auctionPricingRange._id,
      }).sort({ bidPrice: -1 }).limit(2);

      if (winners.length === 0) {
        // Trường hợp không có giá đấu nào
        auctionPricingRange.status = 'ended';
        await auctionPricingRange.save();

        return {
          success: true,
          code: 'KHONG_CO_DAU_THAU',
          msg: 'Đấu giá đã kết thúc nhưng không có giá đấu nào',
          status: 200,
          statusOutOfTime: true,
          statuscheckAuctionTime: 2
        };
      } else {
        // Đẩy người đấu giá cao nhất vào bảng AuctionWinner
        const currentTime = new Date();
        for (let i = 0; i < winners.length; i++) {
          const winner = winners[i];
          const auctionWinner = new AuctionWinner({
            user: winner.user,
            auctionPricingRange: auctionPricingRange._id,
            bidPrice: winner.bidPrice,
            bidTime: winner.bidTime,
            auctionRound: winner.auctionRound,
            auctionStatus: i === 0 ? 'won' : 'pending',
            startTime: currentTime,
            endTime: new Date(currentTime.getTime() + (i === 0 ? 3 : 5) * 24 * 60 * 60 * 1000), 
          });
          await auctionWinner.save();
        }

        // Cập nhật trạng thái của bảng AuctionPricingRange
        auctionPricingRange.status = 'ended';
        await auctionPricingRange.save();

        return {
          success: true,
          code: 'DAU_GIA_KET_THUC',
          msg: 'Đấu giá đã kết thúc, người thắng cuộc đã được ghi nhận',
          status: 200,
          statusOutOfTime: true,
          statuscheckAuctionTime: 3
        };
      }
    } else {
      return {
        success: true,
        code: 'DAU_GIA_DANG_DIEN_RA',
        msg: 'Đấu giá vẫn đang diễn ra',
        status: 200,
        statusOutOfTime: false,
        statuscheckAuctionTime: 4
      };
    }
  }
};

module.exports = AuctionService;



