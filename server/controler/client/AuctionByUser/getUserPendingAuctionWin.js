const { checkAndUpdateUserPendingAuctionWins } = require('../../../services/auctionService/checkUserPendingAuctionWinService');
const User = require('../../../model/users.model');

const getUserPendingAuctionWins = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ code: 'THIEU_USER_ID', msg: 'Thiếu userId trong yêu cầu.' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ code: 'KHONG_TIM_THAY_NGUOI_DUNG', msg: 'Không tìm thấy người dùng.' });
    }

    const { pendingAuctionWins, isUpdated } = await checkAndUpdateUserPendingAuctionWins(userId);

    if (!isUpdated) {
      return res.status(200).json({ code: 'SUCCESS', status: 'success', msg: 'Lý do hủy đơn trúng đấu giá là do hết thời gian mà bạn không bấm xác nhận nên hệ thống ghi nhận và tự động hủy đơn trúng đấu giá của bạn.' });
    }

    if (!pendingAuctionWins.length) {
      return res.status(200).json({ code: 'KHONG_CO_KET_QUA_DAU_GIA', msg: 'Không tìm thấy kết quả đấu giá nào với trạng thái pending cho người dùng này.', data: [] });
    }

    return res.status(200).json({ code: 'THANH_CONG', msg: 'Hết thời gian nên là hệ thống sẽ hủy đơn trúng đấu giá của bạn', data: pendingAuctionWins });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 'LOI_MAY_CHU', msg: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

module.exports = { getUserPendingAuctionWins };
