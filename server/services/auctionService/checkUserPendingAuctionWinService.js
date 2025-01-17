const AuctionWinner = require('../../model/productAuction/auctionWinner');
const User = require('../../model/users.model');
const AuctionPriceHistory = require('../../model/productAuction/auctionPriceHistory');

const checkAndUpdateUserPendingAuctionWins = async (userId) => {
  const query = {
    user: userId,
    auctionStatus: { $in: ['won', 'pending', 'temporary'] }
  };

  const pendingAuctionWinners = await AuctionWinner.find(query)
    .populate({
      path: 'auctionPricingRange',
      populate: {
        path: 'product_randBib',
        select: 'product_name'
      }
    })
    .populate({ path: 'auctionRound', select: 'auctionPricing participants bids status' })
    .populate({ path: 'user', select: 'name email avatar' });

  const currentTime = new Date().getTime();

  const updateUserWarningStatus = async (user) => {
    user.warning += 1;
    user.noteWarning = `Cảnh báo lần ${user.warning}: Nếu tiếp tục hủy kết quả đấu giá ${3 - user.warning} lần nữa, tài khoản của bạn sẽ bị khóa.`;
    if (user.warning >= 3) {
      user.status = 'disabled';
      user.disabledAt = new Date();
      user.message = 'Tài khoản của bạn đã bị khóa do hủy kết quả đấu giá nhiều lần.';
    }
    await user.save();
  };

  let isUpdated = false;

  for (const auction of pendingAuctionWinners) {
    if (!['pending', 'temporary'].includes(auction.auctionStatus)) {
      continue;
    }

    if (new Date(auction.endTime).getTime() < currentTime && auction.confirmationStatus === 'pending') {
      auction.confirmationStatus = 'canceled';
      auction.status = 'disabled';
      auction.auctionStatus = 'lose';
      auction.notWinner = false;
      auction.noteAuctionWinner = 'Lý do hủy đơn trúng đấu giá là do hết thời gian mà bạn không bấm xác nhận nên hệ thống ghi nhận và tự động hủy đơn trúng đấu giá của bạn';
      auction.auctionStausCheck = 'Đã duyệt hủy chiến thắng';

      const auctionPricingRange = auction.auctionPricingRange;
      if (auctionPricingRange.status === 'temporary' && auctionPricingRange.currentPriceTemporarily != null) {
        auctionPricingRange.currentPrice = auctionPricingRange.currentPriceTemporarily;
        auctionPricingRange.startTime = auctionPricingRange.startTimeTemporarily;
        auctionPricingRange.endTime = auctionPricingRange.endTimeTemporarily;
        auctionPricingRange.remainingTime = auctionPricingRange.remainingTimeTemporarily;
        auctionPricingRange.status = 'active';
        auctionPricingRange.currentPriceTemporarily = null;
        auctionPricingRange.startTimeTemporarily = null;
        auctionPricingRange.endTimeTemporarily = null;
        auctionPricingRange.remainingTimeTemporarily = null;
        await auctionPricingRange.save();
      }

      // Update AuctionPriceHistory status to 'disabled'
      await AuctionPriceHistory.updateMany(
        { auctionPricingRange: auctionPricingRange._id, status: 'active' },
        { $set: { status: 'disabled' } }
      );

      await auction.save();

      const user = await User.findById(auction.user);
      if (user) {
        await updateUserWarningStatus(user);
      }

      isUpdated = true;
    } else {
      const endTime = new Date(auction.endTime).getTime();
      const remainingTime = endTime - currentTime;
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      auction.remainingTime = remainingTime > 0
        ? `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`
        : "Đã kết thúc";
    }
  }

  return { pendingAuctionWins: pendingAuctionWinners, isUpdated };
};

module.exports = { checkAndUpdateUserPendingAuctionWins };
