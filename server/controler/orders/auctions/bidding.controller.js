const biddingService = require("../../../services/orders/auctions/biiding.service"); // Đường dẫn đến service
const SocketService = require("../../../services/serviceSocket");
const BiddingController = {
  // Hàm để xử lý yêu cầu tạo đấu giá
  createBid: async (req, res) => {
    try {
      // const {productId} = req.params;
      const {productId, bidInput} = req.body; // Lấy bidInput từ req.body
      const userId = req.user.id; // Giả định rằng thông tin người dùng có trong req.user sau khi xác thực

      // Gọi service để tạo đấu giá
      const newBid = await biddingService.createBid(
        productId,
        userId,
        bidInput
      );
      SocketService.emitCreateBidding(productId, newBid);

      return res.status(201).json({
        success: true,
        status: 201,
        error: "Tạo thành công",
        data: newBid,
      }); // Trả về kết quả thành công
    } catch (error) {
      console.error("Error in controller createBid:", error.message);
      return res
        .status(500)
        .json({ message: `Không thể tạo lượt đấu giá: ${error.message}` });
    }
  },
  getBidsByUser : async (req, res) => {
    try {
        const userId = req.query.userId;
        const result = await biddingService.getBidsByUser(userId);

        res.status(200).json( {
success: true,
          message: "Lượt đấu giá đã được xóa thành công.",
          data: result
        } );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},
  getAllBids: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await biddingService.getAllBids(
        parseInt(page),
        parseInt(limit)
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error in getAllBids controller:", error.message);
      return res.status(500).json({
        success: false,
        message: `Không thể lấy danh sách lượt đấu giá: ${error.message}`,
      });
    }
  },

  getBidById: async (req, res) => {
    try {
      const { bidId } = req.params;
  
      
      const bid = await biddingService.getBidById(bidId);

      return res.status(200).json({
        success: true,
        status:200,
        data: bid,
      });
    } catch (error) {
      console.error("Error in getBidById controller:", error.message);
      return res.status(500).json({
        success: false,
        message: `Không thể lấy lượt đấu giá: ${error.message}`,
      });
    }
  },

  softDeleteBid: async (req, res) => {
    try {
      const { bidId } = req.params;
    
      
      const result = await biddingService.softDeleteBid(bidId);

      return res.status(200).json({
        success: true,
        message: "Lượt đấu giá đã được xóa thành công.",
        data: result,
      });
    } catch (error) {
      console.error("Error in softDeleteBid controller:", error.message);
      return res.status(500).json({
        success: false,
        message: `Không thể xóa lượt đấu giá: ${error.message}`,
      });
    }
  },

  deleteBids: async (req, res) => {
    try {
      const { bidIds } = req.body;

      const result = await biddingService.deleteBids(bidIds);

      return res.status(200).json({
        success: true,
        message: "Các lượt đấu giá đã được xóa thành công.",
        data: result,
      });
    } catch (error) {
      console.error("Error in deleteBids controller:", error.message);
      return res.status(500).json({
        success: false,
        message: `Không thể xóa nhiều lượt đấu giá: ${error.message}`,
      });
    }
  },
  getSoftDeletedBids: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
      const limit = parseInt(req.query.limit) || 5; // Default to 10 items per page if not specified

      const result = await biddingService.getSoftDeletedBids(page, limit);

      return res.status(200).json({
        success: true,
        message: "Danh sách lượt đấu giá đã xóa mềm được lấy thành công.",
        data: result,
      });
    } catch (error) {
      console.error("Error in getSoftDeletedBids controller:", error.message);
      return res.status(500).json({
        success: false,
        message: `Không thể lấy danh sách lượt đấu giá đã xóa mềm: ${error.message}`,
      });
    }
  },
  restoreBid: async (req, res) => {
    try {
      const { bidId } = req.params;

      const result = await biddingService.restoreBid(bidId);

      return res.status(200).json({
        success: true,
        message: "Lượt đấu giá đã được khôi phục thành công.",
        data: result,
      });
    } catch (error) {
      console.error("Error in restoreBid controller:", error.message);
      return res.status(500).json({
        success: false,
        message: `Không thể khôi phục lượt đấu giá: ${error.message}`,
      });
    }
  },
};

module.exports = BiddingController;
