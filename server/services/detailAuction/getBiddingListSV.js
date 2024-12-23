const AuctionPriceHistory = require("../../model/productAuction/auctionPriceHistory");
const AuctionPricingRange = require("../../model/productAuction/auctionPricingRange");
const ProductAuction = require("../../model/productAuction/productAuction");

const BiddingService = {
  getBiddingListService: (slug, page = 1, limit = 5) => new Promise(async (resolve, reject) => {
    try {
      const offset = (page - 1) * limit;

      // Tìm sản phẩm dựa trên slug
      const product = await ProductAuction.findOne({ slug })
        .populate("auctionPricing") // Lấy thông tin phiên đấu giá liên quan
        .exec();

      if (!product || !product.auctionPricing) {
        return resolve({
          success: false,
          err: 1,
          msg: "Không tìm thấy phiên đấu giá tương ứng với slug.",
          status: 404,
        });
      }

      const auctionPricing = product.auctionPricing;

      // Kiểm tra trạng thái của phiên đấu giá
      if (auctionPricing.status !== "active") {
        return resolve({
          success: false,
          err: 1,
          msg: "Phiên đấu giá không hoạt động.",
          status: 400,
        });
      }

      // Tìm lịch sử đấu giá liên quan đến phiên đấu giá
      const total = await AuctionPriceHistory.countDocuments({
        auctionPricingRange: auctionPricing._id,
      });

      const biddingList = await AuctionPriceHistory.find({
        auctionPricingRange: auctionPricing._id,
      })
        .populate("user", "name") // Populate thông tin người tham gia
        .sort({ bidPrice: -1 }) // Sắp xếp theo giá từ cao xuống thấp
        .skip(offset) // Bỏ qua các bản ghi trước đó
        .limit(limit) // Lấy số bản ghi theo limit
        .select("user bidPrice bidTime"); // Lấy các trường cần thiết

      resolve({
        success: true,
        err: 0,
        msg: biddingList.length ? "Lấy danh sách đấu giá thành công." : "Không có dữ liệu đấu giá.",
        status: 200,
        response: {
          productDetails: {
            id: product._id,
            productName: product.product_name,
            slug: slug,
          },
          biddingList,
          pagination: {
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      reject({
        success: false,
        err: -1,
        msg: "Đã xảy ra lỗi khi lấy danh sách đấu giá: " + error.message,
        status: 500,
      });
    }
  }),
};

module.exports = BiddingService;
