const { getIO } = require('../../../services/skserver/socketServer'); 
const AuctionWinner = require('../../../model/productAuction/auctionWinner');
const AuctionPriceHistory = require('../../../model/productAuction/auctionPriceHistory');
const mongoose = require('mongoose');

const updateUserWarningStatus = async (user, session) => {
  user.warning += 1;
  user.noteWarning = `Cảnh báo lần ${user.warning}: Nếu tiếp tục hủy kết quả đấu giá ${3 - user.warning} lần nữa, tài khoản của bạn sẽ bị khóa.`;

  if (user.warning === 1) {
    user.timeLimit = new Date(Date.now() + 20 * 60 * 1000); 
    user.statusWarningTimeout = true;
  } else if (user.warning === 2) {
    user.timeLimit = new Date(Date.now() + 40 * 60 * 1000); 
    user.statusWarningTimeout = true;
  } else if (user.warning >= 3) {
    user.statusAuction = 'disabled'; 
    user.isBanned = true;
    user.disabledAt = new Date();
    user.message = 'Tài khoản của bạn đã bị khóa do hủy kết quả đấu giá 3 lần.';
  }
  await user.save({ session });
};

const canceledAuctionTemporary = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { auctionWinnerId } = req.body;
    const auctionWinner = await AuctionWinner.findById(auctionWinnerId)
      .populate('auctionPricingRange')
      .populate({ path: 'user', select: '_id name email noteWarning warning timeLimit' })
      .populate({ path: 'product_randBib', select: 'slug' }) 
      .session(session);

    if (!auctionWinner) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        code: 'KHONG_TIM_THAY_DAU_GIA', 
        msg: 'Không tìm thấy kết quả đấu giá.', 
        status: 'error',
        error: 'Auction winner not found' 
      });
    }

    if (auctionWinner.auctionStatus !== 'temporary') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        code: 'KHONG_PHU_HOP_DIEU_KIEN',
        msg: 'Trạng thái đấu giá không phải là "temporary".',
        status: 'error',
        error: 'Auction status is not "temporary"'
      });
    }

    const auctionPricingRange = auctionWinner.auctionPricingRange;
    if (auctionPricingRange.status !== 'temporary') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        code: 'KHONG_PHU_HOP_DIEU_KIEN',
        msg: 'Trạng thái "auctionPricingRange" không phải là "temporary".',
        status: 'error',
        error: 'AuctionPricingRange status is not "temporary"'
      });
    }

    const slug = auctionWinner.product_randBib.slug;

    if (auctionPricingRange.currentPriceTemporarily != null) {
      auctionPricingRange.currentPrice = auctionPricingRange.currentPriceTemporarily;
      auctionPricingRange.startTime = auctionPricingRange.startTimeTemporarily;
      auctionPricingRange.endTime = auctionPricingRange.endTimeTemporarily;
      auctionPricingRange.remainingTime = auctionPricingRange.remainingTimeTemporarily;
      auctionPricingRange.status = 'active';
      auctionPricingRange.currentPriceTemporarily = null;
      auctionPricingRange.startTimeTemporarily = null;
      auctionPricingRange.endTimeTemporarily = null;
      auctionPricingRange.remainingTimeTemporarily = null;
      await auctionPricingRange.save({ session });
    }

    const user = auctionWinner.user;

    await AuctionPriceHistory.updateMany(
      { auctionPricingRange: auctionPricingRange._id, status: 'active', user: user._id },
      { $set: { status: 'disabled' } },
      { session }
    );

    auctionWinner.confirmationStatus = 'canceled';
    auctionWinner.status = 'disabled';
    auctionWinner.auctionStatus = 'canceled';
    auctionWinner.notWinner = false;
    await auctionWinner.save({ session });

    await updateUserWarningStatus(user, session);

    const io = getIO();
    io.emit('auctionCanceled', {  
      auctionWinnerId: auctionWinner._id,
      userId: user._id,
      userMessage: user.message,
      userWarning: user.warning,
      status: auctionWinner.status,
      auctionStatus: auctionWinner.auctionStatus,
      slug: slug,
    });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      code: 'THANH_CONG',
      msg: 'Kết quả đấu giá tạm thời đã bị hủy và người dùng đã được cảnh báo.',
      status: 'success',
      error: null,
      data: {
        auctionWinner: {
          id: auctionWinner._id,
          user: auctionWinner.user,
          confirmationStatus: auctionWinner.confirmationStatus,
          status: auctionWinner.status,
          auctionStatus: auctionWinner.auctionStatus,
          notWinner: auctionWinner.notWinner,
        },
        user: {
          id: user._id,
          warning: user.warning,
          noteWarning: user.noteWarning,
          status: user.status,
          disabledAt: user.disabledAt,
          message: user.message,
          timeLimit: user.timeLimit,
        },
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({
      code: 'LOI_MAY_CHU',
      msg: 'Lỗi máy chủ. Vui lòng thử lại sau.',
      status: 'error',
      error: error.message,
    });
  }
};

module.exports = {
  canceledAuctionTemporary,
};
