const randBidService = require("../../../services/orders/auctions/priceRandBid.service"); // Đảm bảo đường dẫn chính xác

const randBinController = {
  postRandBid: async (req, res) => {
    // Lấy productId từ URL params
  
    // Lấy bidInput từ request body
    const {productId, bidInput } = req.body;

    try {
      // Lấy thông tin sản phẩm và các giá trị đấu giá từ dịch vụ
      const product = await randBidService.getProductPriceRange(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Sản phẩm không tìm thấy hoặc không phải là đấu giá.",
        });
      }

      // Tính toán minBid, midBid và maxBid
      const minBid = product.product_price_unit;
      const midBid = minBid + minBid * 0.03; // midBid = minBid + 3%
      const maxBid = midBid + midBid * 0.04; // maxBid = midBid + 4%

      // Kiểm tra điều kiện cho bidInput
      const maxAllowedBidInput = minBid + midBid * 0.1; // bidInput không được vượt quá 10% từ giá minBid
      if (bidInput > maxAllowedBidInput) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: `Bid input không được vượt quá 10% từ giá minBid (${maxAllowedBidInput.toFixed(
            2
          )})`,
          erorr: -4,
        });
      }

      // Nếu điều kiện thỏa mãn, gọi hàm tạo đấu giá từ dịch vụ
      const newBid = await randBidService.createPriceRange(productId, bidInput);

      // Trả về thông tin đấu giá và các giá trị minBid, midBid, maxBid
      res.status(201).json({
        success: true,
        message: "Đấu giá đã được tạo thành công.",
        data: {
          newBid,
          minBid,
          midBid,
          maxBid,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  getRandBid: async (req, res) => {


    try {
      const { productId } = req.params;

      console.log('productId:', productId);
      
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
};

module.exports = randBinController;
