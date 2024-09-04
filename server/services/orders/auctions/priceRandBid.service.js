const PriceRangeBid = require("../../../model/orders/priceRange.model");
const Product_v2 = require("../../../model/product_v2");

const pricRangeBidService = {
  createPriceRange: async (productId, bidInput) => {
    try {
      // Truy vấn sản phẩm từ cơ sở dữ liệu
      const product = await Product_v2.findOne({
        _id: productId,
        status: { $ne: "disable" },
      }).populate("product_format");

      if (!product) {
        throw new Error("Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa.");
      }

      const format = product.product_format.formats.trim();

      if (format !== "Đấu giá") {
        return null;
      }

      // Tính toán giá trị minBid, midBid và maxBid
    

      // Tạo tài liệu mới cho PriceRangeBid
      const minBid = product.product_price_unit;
      const midBid = minBid + (minBid * 0.03); // midBid = minBid + 3%
      const maxBid = midBid + (midBid * 0.04); // maxBid = midBid + 4%

      // Tạo tài liệu mới cho đấu giá
      const newBid = new PriceRangeBid({
        product_randBib: {
          productId: product._id,
          product_price_unit: product.product_price_unit,
          product_name: product.product_name,
          product_format: product.product_format.formats,
        },
        minBid,
        midBid,
        maxBid,
        bidInput,
      });

      // Lưu tài liệu mới vào MongoDB
      const savedBid = await newBid.save();
      return savedBid;
    } catch (error) {
      throw new Error(`Có lỗi xảy ra khi tạo đấu giá: ${error.message}`);
    }
  },

  getProductPriceRange: async (productId) => {
    try {
      const product = await Product_v2.findById({
        _id: productId,
        status: { $ne: "disable" },
      }).populate("product_format");

      const format = product.product_format.formats.trim();

      if (format !== "Đấu giá") {
        return null;
      }

      const minBid = product.product_price_unit;

      const midBid = minBid + minBid * 0.03;
      const maxBid = midBid + midBid * 0.04;

      return { minBid, midBid, maxBid };
    } catch (error) {
      throw new Error(
        `Có lỗi xảy ra khi lấy thông tin sản phẩm: ${error.message}`
      );
    }
  },
};

module.exports = pricRangeBidService;
