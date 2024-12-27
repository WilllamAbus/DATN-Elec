const { getAuctionWinsByUserService } = require('../../../services/auctionService/getAuctionWinsByUserService');
const User = require('../../../model/users.model');

const getAuctionWinsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit, confirmationStatus } = req.query;

    if (!userId) {
      return res.status(400).json({ code: 'THIEU_USER_ID', msg: 'Thiếu userId trong yêu cầu.' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ code: 'KHONG_TIM_THAY_NGUOI_DUNG', msg: 'Không tìm thấy người dùng.' });
    }

    const { data: auctionWins, pagination, total } = await getAuctionWinsByUserService(userId, +page || 1, +limit || 10, confirmationStatus || 'pending');

    if (!auctionWins.length) {
      return res.status(200).json({ code: 'KHONG_CO_KET_QUA_DAU_GIA', msg: 'Không tìm thấy kết quả đấu giá trúng nào cho người dùng này.', data: [], pagination: { currentPage: page, totalPages: 0, hasNextPage: false, hasPrevPage: false }, total });
    }

    return res.status(200).json({ code: 'THANH_CONG', msg: 'Danh sách trúng đấu giá được lấy thành công.', data: auctionWins, pagination, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 'LOI_MAY_CHU', msg: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

module.exports = {
  getAuctionWinsByUser,
};
