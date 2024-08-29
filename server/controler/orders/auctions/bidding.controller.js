const biddingService = require('../../../services/orders/auctions/biiding.service'); // Đường dẫn đến service

const BiddingController = {
  // Hàm để xử lý yêu cầu tạo đấu giá
  createBid: async (req, res) => {
    const { productId } = req.params; // Lấy productId từ req.params
    const { bidInput } = req.body; // Lấy bidInput từ req.body
    const userId = req.user.id; // Giả định rằng thông tin người dùng có trong req.user sau khi xác thực

    try {
      // Gọi service để tạo đấu giá
      const newBid = await biddingService.createBid(productId, userId, bidInput);
      
      return res.status(201).json({
        success: true,
        status:201,
        error: 'Tạo thành công',
        data: newBid
      }); // Trả về kết quả thành công

    } catch (error) {
      console.error('Error in controller createBid:', error.message);
      return res.status(500).json({ message: `Không thể tạo đấu giá: ${error.message}` });
    }
  }
};

module.exports = BiddingController;
