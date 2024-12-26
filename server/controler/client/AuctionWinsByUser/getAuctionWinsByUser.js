const AuctionWinner = require('../../../model/productAuction/auctionWinner');
const User = require('../../../model/users.model'); // Cập nhật đường dẫn theo cấu trúc của bạn

// Controller để lấy danh sách trúng đấu giá của người dùng
const getAuctionWinsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const auctionWins = await AuctionWinner.find({ user: userId }).populate('auctionPricingRange auctionRound user');

    if (!auctionWins.length) {
      return res.status(404).json({ message: 'Không tìm thấy kết quả đấu giá trúng nào cho người dùng này.' });
    }

    res.status(200).json(auctionWins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

module.exports = {
  getAuctionWinsByUser,
};
