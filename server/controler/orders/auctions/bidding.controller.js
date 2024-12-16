const biddingService = require("../../../services/orders/auctions/biiding.service"); // Đường dẫn đến service
const SocketService = require("../../../services/serviceSocket");
const BiddingController = {
  // Hàm để xử lý yêu cầu tạo đấu giá
  createBid: async (req, res) => {
    try {
      // const {productId} = req.params;
      const {productId,  bidAmount} = req.body; // Lấy bidInput từ req.body
      const userId = req.user.id; // Giả định rằng thông tin người dùng có trong req.user sau khi xác thực
   
      // Gọi service để tạo đấu giá
      const newBid = await biddingService.createBid(
        productId,
        userId,
        bidAmount
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

  updateBidAmountController : async (req, res) => {
    try {
     // Extract userId, productId, and bidAmount from request body
        const {productId,  bidAmount} = req.body; // Lấy bidInput từ req.body
        const userId = req.user.id;
        // Call the service to update the bid amount
        const updatedBid = await biddingService.updateBidAmountService(userId, 
          productId, 
          bidAmount);

        if (!updatedBid) {
            return res.status(400).json({ message: 'Unable to update bid amount. Product might not be an auction or bid is invalid.' });
        }
        SocketService.emitUpdateAmountBidding(productId, updatedBid);
        return res.status(200).json({
          success:true,
          status:200,
            message: 'Cập nhật giá của lượt đấu giá thành công.',
            data: updatedBid
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
},
  getBidsByUser : async (req, res) => {
    try {
        const userId = req.user.id;
    
        
        const result = await biddingService.getBidsByUser(userId);

        res.status(200).json( {
          success: true,
          message: "Lấy lượt đấu giá thành công.",
          data: result
        } );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},
  getAllBids: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;


   

      const { Bidding, totalPages, currentPage }  = await biddingService.getAllBids(
        page,
        pageSize,
 
      
      );
      return res.status(200).json({
        success: true,
        data: {
          Bidding,
          totalPages,
          currentPage
        },
      });
    } catch (error) {
      console.error("Error in getAllBids controller:", error.message);
      return res.status(500).json({
        success: false,
        message: `Không thể lấy danh sách lượt đấu giá: ${error.message}`,
      });
    }
  },
  getAllBidsActive: async (req, res) => {
    try {
      const pageActive = parseInt(req.query.page) || 1;
      const pageSizeActive = parseInt(req.query.pageSize) || 10;


   

      const { biddingActive, totalPagesActive, currentPageActive }  = await biddingService.getAllBidsActive(
        pageActive,
        pageSizeActive,
 
      
      );
      return res.status(200).json({
        success: true,
        data: {
          biddingActive,
          totalPagesActive,
          currentPageActive
        },
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
