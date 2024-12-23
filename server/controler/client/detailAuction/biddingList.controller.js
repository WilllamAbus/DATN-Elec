const AuctionPriceHistory = require("../../../model/productAuction/auctionPriceHistory");
const AuctionPricingRange = require("../../../model/productAuction/auctionPricingRange");
const ProductAuction = require("../../../model/productAuction/productAuction");
/**
 * Lấy danh sách người tham gia đấu giá và lọc theo giá từ cao đến thấp
 */
const getBiddingList = async (req, res) => {
  const { slug } = req.params; // Lấy slug từ URL

  try {
    // Tìm sản phẩm dựa trên slug
    const product = await ProductAuction.findOne({ slug })
      .populate("auctionPricing") // Lấy thông tin phiên đấu giá liên quan
      .exec();

    if (!product || !product.auctionPricing) {
      return res.status(404).json({
        success: false,
        msg: "Không tìm thấy phiên đấu giá tương ứng với slug.",
      });
    }

    const auctionPricing = product.auctionPricing;

    // Kiểm tra trạng thái của phiên đấu giá
    if (auctionPricing.status !== "active") {
      return res.status(400).json({
        success: false,
        msg: "Phiên đấu giá không hoạt động.",
      });
    }

    // Tìm lịch sử đấu giá liên quan đến phiên đấu giá
    const biddingList = await AuctionPriceHistory.find({
      auctionPricingRange: auctionPricing._id,
    })
      .populate("user", "name") // Populate thông tin người tham gia
      .sort({ bidPrice: -1 }) // Sắp xếp theo giá từ cao xuống thấp
      .select("user bidPrice bidTime"); // Lấy các trường cần thiết

    return res.status(200).json({
      success: true,
      msg: "Lấy danh sách đấu giá thành công.",
      data: {
        productDetails: {
          id: product._id,
          productName: product.product_name,
          slug: slug,
        },
        biddingList: biddingList,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đấu giá:", error);
    return res.status(500).json({
      success: false,
      msg: "Đã xảy ra lỗi khi lấy danh sách đấu giá.",
    });
  }
};

module.exports = {
  getBiddingList,
};
