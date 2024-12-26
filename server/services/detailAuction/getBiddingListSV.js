const AuctionPriceHistory = require("../../model/productAuction/auctionPriceHistory");
const AuctionPricingRange = require("../../model/productAuction/auctionPricingRange");
const ProductAuction = require("../../model/productAuction/productAuction");
const AuctionWinner = require("../../model/productAuction/auctionWinner");

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


  // Hàm xác định người thắng khi hết thời gian đấu giá
  processAuctionWinner: (slug) => new Promise(async (resolve, reject) => {
    try {
      // Tìm sản phẩm dựa trên slug
      const product = await ProductAuction.findOne({ slug })
        .populate("auctionPricing")
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

      // Kiểm tra thời gian đấu giá
      const currentTime = new Date();
      if (auctionPricing.endTime && currentTime < auctionPricing.endTime) {
        return resolve({
          success: false,
          err: 1,
          msg: "Phiên đấu giá chưa kết thúc.",
          status: 400,
        });
      }

      // Lấy danh sách đấu giá liên quan
      const biddingList = await AuctionPriceHistory.find({
        auctionPricingRange: auctionPricing._id,
      })
        .populate("user", "name") // Populate thông tin người tham gia
        .sort({ bidPrice: -1 }) // Sắp xếp giá từ cao xuống thấp
        .limit(1) // Lấy người đặt giá cao nhất
        .exec();

      if (!biddingList.length) {
        return resolve({
          success: false,
          err: 1,
          msg: "Không có người tham gia đấu giá.",
          status: 404,
        });
      }

      const highestBid = biddingList[0];

      // Kiểm tra xem đã có người thắng trong bảng `AuctionWinner` chưa
      const existingWinner = await AuctionWinner.findOne({
        auctionPricingRange: auctionPricing._id,
        auctionRound: auctionPricing.auctionRound,
      });

      if (existingWinner) {
        return resolve({
          success: false,
          err: 1,
          msg: "Người thắng đã được xác định.",
          status: 400,
        });
      }

      // Lưu thông tin người thắng vào bảng `AuctionWinner`
      const newWinner = new AuctionWinner({
        auctionPricingRange: auctionPricing._id,
        auctionRound: auctionPricing.auctionRound,
        user: highestBid.user._id,
        bidPrice: highestBid.bidPrice,
        paymentStatus: "pending",
        auctionStatus: "won",
        auctionStausCheck: "Chờ duyệt",
      });

      await newWinner.save();

      resolve({
        success: true,
        err: 0,
        msg: "Xác định người thắng thành công.",
        status: 200,
        response: {
          winner: {
            user: highestBid.user.name,
            bidPrice: highestBid.bidPrice,
          },
        },
      });
    } catch (error) {
      reject({
        success: false,
        err: -1,
        msg: "Đã xảy ra lỗi khi xử lý người thắng: " + error.message,
        status: 500,
      });
    }
  }),


  getUserBiddingHistoryService: (userId, page = 1, limit = 5) => new Promise(async (resolve, reject) => {
    try {
      const offset = (page - 1) * limit;

      // Tìm tất cả các bản ghi lịch sử đấu giá liên quan đến userId
      const total = await AuctionPriceHistory.countDocuments({ user: userId });

      const biddingHistory = await AuctionPriceHistory.find({ user: userId })
        .populate({
          path: "auctionPricingRange",
          populate: {
            path: "product", // Populate thông tin sản phẩm liên quan
            select: "product_name slug",
          },
        })
        .sort({ bidTime: -1 }) // Sắp xếp theo thời gian đấu giá gần nhất
        .skip(offset)
        .limit(limit)
        .select("bidPrice bidTime auctionPricingRange"); // Lấy các trường cần thiết

      // Format dữ liệu
      const history = biddingHistory.map((bid) => ({
        productId: bid.auctionPricingRange?.product?._id || null,
        productName: bid.auctionPricingRange?.product?.product_name || "Sản phẩm không xác định",
        slug: bid.auctionPricingRange?.product?.slug || null,
        bidPrice: bid.bidPrice,
        bidTime: bid.bidTime,
      }));

      resolve({
        success: true,
        err: 0,
        msg: history.length ? "Lấy lịch sử đấu giá thành công." : "Không có dữ liệu lịch sử đấu giá.",
        status: 200,
        response: {
          history,
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
        msg: "Đã xảy ra lỗi khi lấy lịch sử đấu giá: " + error.message,
        status: 500,
      });
    }


  }),


  getUserBiddingDetailsService: (userId, productSlug) => new Promise(async (resolve, reject) => {
    try {
      // Tìm sản phẩm dựa trên slug
      const product = await ProductAuction.findOne({ slug: productSlug })
        .populate("auctionPricing") // Lấy thông tin phiên đấu giá liên quan
        .exec();

      if (!product || !product.auctionPricing) {
        return resolve({
          success: false,
          err: 1,
          msg: "Không tìm thấy sản phẩm tương ứng với slug.",
          status: 404,
        });
      }

      const auctionPricing = product.auctionPricing;

      // Tìm tất cả các bản ghi đấu giá của userId liên quan đến sản phẩm này
      const userBiddingDetails = await AuctionPriceHistory.find({
        user: userId,
        auctionPricingRange: auctionPricing._id,
      })
        .sort({ bidTime: -1 }) // Sắp xếp theo thời gian đấu giá gần nhất
        .select("bidPrice bidTime"); // Lấy các trường cần thiết

      resolve({
        success: true,
        err: 0,
        msg: userBiddingDetails.length ? "Lấy chi tiết lịch sử đấu giá thành công." : "Người dùng chưa tham gia đấu giá sản phẩm này.",
        status: 200,
        response: {
          productDetails: {
            id: product._id,
            productName: product.product_name,
            slug: productSlug,
          },
          userBiddingDetails,
        },
      });
    } catch (error) {
      reject({
        success: false,
        err: -1,
        msg: "Đã xảy ra lỗi khi lấy chi tiết lịch sử đấu giá: " + error.message,
        status: 500,
      });
    }
  }),

}

  module.exports = BiddingService;
