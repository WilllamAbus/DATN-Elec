const AuctionWinner = require('../../../model/productAuction/auctionWinner');
const mongoose = require('mongoose');

const updateUserWarningStatus = (user) => {
  user.warning += 1;
  user.noteWarning = `Cảnh báo lần ${user.warning}: Nếu tiếp tục hủy kết quả đấu giá ${3 - user.warning} lần nữa, tài khoản của bạn sẽ bị khóa.`;

  if (user.warning >= 100) {
    user.status = 'disabled'; 
    user.disabledAt = new Date();
    user.messgese = 'Tài khoản của bạn đã bị khóa do hủy kết quả đấu giá 3 lần.';
  }
};

const canceledAuction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { auctionWinnerId } = req.body;
    const auctionWinner = await AuctionWinner.findById(auctionWinnerId).populate('user').session(session);

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

    auctionWinner.confirmationStatus = 'canceled';
    auctionWinner.status = 'disabled';
    auctionWinner.auctionStatus = 'canceled';
    await auctionWinner.save({ session });

    const user = auctionWinner.user;
    updateUserWarningStatus(user);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      code: 'THANH_CONG',
      msg: 'Kết quả đấu giá đã bị hủy và người dùng đã được cảnh báo.',
      status: 'success',
      error: null,
      data: {
        auctionWinner: {
          id: auctionWinner._id,
          user: auctionWinner.user,
          confirmationStatus: auctionWinner.confirmationStatus,
          status: auctionWinner.status,
          auctionStatus: auctionWinner.auctionStatus,
        },
        user: {
          id: user._id,
          warning: user.warning,
          noteWarning: user.noteWarning,
          status: user.status,
          disabledAt: user.disabledAt,
          messgese: user.messgese,
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
  canceledAuction,
};
