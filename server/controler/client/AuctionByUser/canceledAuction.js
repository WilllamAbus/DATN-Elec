const AuctionWinner = require('../../../model/productAuction/auctionWinner');


const canceledAuction = async (req, res) => {
  try {
    const { auctionWinnerId } = req.body;
    const auctionWinner = await AuctionWinner.findById(auctionWinnerId).populate('user');

    if (!auctionWinner) {
      return res.status(404).json({ code: 'KHONG_TIM_THAY_DAU_GIA', msg: 'Không tìm thấy kết quả đấu giá.' });
    }

    auctionWinner.confirmationStatus = 'canceled';
    await auctionWinner.save();

    const user = auctionWinner.user;
    user.warning += 1;


    user.noteWarning = `Cảnh báo lần ${user.warning}: Nếu tiếp tục hủy kết quả đấu giá ${3 - user.warning} lần nữa, tài khoản của bạn sẽ bị khóa.`;

    if (user.warning >= 3) {
      user.status = 'disabled'; 
      user.disabledAt = new Date();
      user.messgese = 'Tài khoản của bạn đã bị khóa do hủy kết quả đấu giá 3 lần.';
    }

    await user.save();

    return res.status(200).json({ code: 'THANH_CONG', msg: 'Kết quả đấu giá đã bị hủy và người dùng đã được cảnh báo.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 'LOI_MAY_CHU', msg: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

module.exports = {
  canceledAuction,
};
