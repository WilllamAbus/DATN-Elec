const randBidService = require("../../../services/orders/auctions/priceRandBid.service"); // Đảm bảo đường dẫn chính xác

const randBinController = {
  postRandBid: async (req, res) => {
    // Lấy productId từ URL params
  
    // Lấy bidInput từ request body
 
    
    try {
      const {productId, bidInput } = req.body;
   
      
      


      // Nếu điều kiện thỏa mãn, gọi hàm tạo đấu giá từ dịch vụ
      const newBid = await randBidService.createPriceRange(productId, bidInput);
   
      
      // Trả về thông tin đấu giá và các giá trị minBid, midBid, maxBid
      res.status(201).json({
        success: true,
        message: "Đấu giá đã được tạo thành công.",
        data:  newBid,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  getRandBid: async (req, res) => {


    try {
      const { productId } = req.params;

   
      
      // Truy vấn sản phẩm để lấy các giá trị minBid, midBid, maxBid
      const product = await randBidService.getProductPriceRange(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          status: 400,
          message: "Sản phẩm không tồn tại.",
        });
      }

      res.status(200).json({
        success: true,
        status: 200,
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        status: 400,
        message: error.message,
      });
    }
  },

  getProductAuctionAdmin: async (req, res) => {
    try {
      const products = await randBidService.getProductAuctionAdmin();

      return res.status(200).json({
        status: 200,
        message: 'Lấy danh sách sản phẩm thành công',
        data: products,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Lỗi server: ' + error.message,
      });
    }
  },

  getAllPriceRange: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const search = req.query.search || '';

      const { priceRanges, totalPages, currentPage }  = await randBidService.getAllPriceRange(
        page,
        pageSize,
        search,
      
      );

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách đấu giá thành công",
        data: {
          priceRanges,
          totalPages,
          currentPage
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  editPriceRange: async (req, res) => {
    try {
      const { priceRangeBidId } = req.params;
      const { bidInput } = req.body;

      const updatedBid = await randBidService.editPriceRange(
        priceRangeBidId,
        bidInput
      );

      return res.status(200).json({
        success: true,
        message: "Chỉnh sửa đấu giá thành công",
        data: updatedBid,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  restorePriceRangeBid: async (req, res) => {
    try {
      const { priceRangeBidId } = req.params;

      const updatedBid = await pricRangeBidService.restorePriceRangeBid(
        priceRangeBidId
      );

      return res.status(200).json({
        success: true,
        message: "Khôi phục đấu giá thành công",
        data: updatedBid,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  restorePriceRangeBid: async (req, res) => {
    try {
      const { id } = req.params;

      const updatedBid = await randBidService.restorePriceRangeBid(
        id
      );

      return res.status(200).json({
        success: true,
        message: "Khôi phục đấu giá thành công",
        data: updatedBid,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  softDeletePriceRangeBid: async (req, res) => {
    try {
      const { id } = req.params;

      const updatedBid = await randBidService.softDeletePriceRangeBid(
        id
      );

      return res.status(200).json({
        success: true,
        message: "Xóa mềm đấu giá thành công",
        data: updatedBid,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getDeletedPriceRangeBid: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 5;
      const search = req.query.search || '';

      const { priceRanges, totalPages, currentPage }  = await randBidService.getDeletedPriceRangeBid(
        page,
        pageSize,
        search,
      
      );

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách đấu giá thành công",
        data: {
          priceRanges,
          totalPages,
          currentPage
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = randBinController;
