const AuctionPriceHistory = require("../../model/productAuction/auctionPriceHistory");
const ProductAuction = require("../../model/productAuction/productAuction");
const AuctionRound = require("../../model/productAuction/auctionRound");
const AuctionUserHistories = require("../../model/productAuction/userAuctionHistory");
const mongoose = require('mongoose');

const BiddingService = {
  getBiddingListAndWinnerService: (slug, page = 1, limit = 5) =>
    new Promise(async (resolve, reject) => {
      try {
        const offset = (page - 1) * limit;

        // Tìm sản phẩm dựa trên slug
        const product = await ProductAuction.findOne({ slug })
          .populate({
            path: "auctionPricing",
          }) // Chỉ populate auctionPricing
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

        // Lấy danh sách lịch sử đấu giá
        const total = await AuctionPriceHistory.countDocuments({
          auctionPricingRange: auctionPricing._id,
          status: 'active', // Chỉ lấy những bản ghi có trạng thái "active"
        });

        const biddingList = await AuctionPriceHistory.find({
          auctionPricingRange: auctionPricing._id,
          status: 'active', // Chỉ lấy những bản ghi có trạng thái "active"
        })
          .populate("user", "name") // Lấy thông tin người dùng
          .sort({ bidPrice: -1 }) // Sắp xếp giá từ cao đến thấp
          .skip(offset)
          .limit(limit)
          .select("user bidPrice bidTime"); // Chỉ chọn các trường cần thiết

        resolve({
          success: true,
          err: 0,
          msg: "Lấy danh sách đấu giá thành công.",
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
          msg: "Đã xảy ra lỗi: " + error.message,
          status: 500,
        });
      }
    }),
  
  
  
  
  




  getUserParticipatedProductsService: (userId) =>
    new Promise(async (resolve, reject) => {
      try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId.toString())) {
          return reject({
            success: false,
            err: 1,
            msg: "User ID không hợp lệ.",
            status: 400,
          });
        }

        const auctionRounds = await AuctionRound.find({
          "bids.user": new mongoose.Types.ObjectId(userId.toString()), 
        }).populate({
          path: "auctionPricing",
          populate: {
            path: "product_randBib",
            select: "product_name slug image",
          },
          select: "status", // Thêm 'status' vào danh sách trường được chọn
        });

        if (!auctionRounds || !auctionRounds.length) {
          return resolve({
            success: false,
            err: 1,
            msg: "Không có dữ liệu đấu giá nào.",
            status: 404,
          });
        }

        const uniqueProducts = {};
        auctionRounds.forEach((round) => {
          const product = round.auctionPricing?.product_randBib;
          const status = round.auctionPricing?.status; // Lấy trường status từ auctionPricing
          if (product && !uniqueProducts[product._id]) {
            uniqueProducts[product._id] = {
              productId: product._id,
              productName: product.product_name,
              slug: product.slug,
              image: product.image[0] || null,
              status, // Thêm status vào dữ liệu trả về
            };
          }
        });

        const productList = Object.values(uniqueProducts);

        resolve({
          success: true,
          err: 0,
          msg: productList.length
            ? "Lấy danh sách sản phẩm thành công."
            : "Người dùng chưa tham gia đấu giá sản phẩm nào.",
          status: 200,
          response: productList,
        });
      } catch (error) {
        reject({
          success: false,
          err: -1,
          msg: "Đã xảy ra lỗi khi lấy danh sách sản phẩm: " + error.message,
          status: 500,
        });
      }
    }),





  getUserProductBiddingDetailsService: (userId, productSlug) => new Promise(async (resolve, reject) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return reject({
          success: false,
          err: 1,
          msg: "User ID không hợp lệ.",
          status: 400,
        });
      }

      const product = await ProductAuction.findOne({ slug: productSlug }).exec();
      if (!product || !product.auctionPricing) {
        return resolve({
          success: false,
          err: 1,
          msg: "Không tìm thấy sản phẩm tương ứng với slug.",
          status: 404,
        });
      }

      const userBiddingHistory = await AuctionUserHistories.findOne({ user: userId })
        .populate('bids.auctionRound')
        .exec();

      if (!userBiddingHistory || !userBiddingHistory.bids.length) {
        return resolve({
          success: false,
          err: 1,
          msg: "Không tìm thấy lịch sử đấu giá của người dùng.",
          status: 404,
        });
      }

      const filteredBids = userBiddingHistory.bids.filter(bid =>
        bid.auctionRound && bid.auctionRound.auctionPricing.toString() === product.auctionPricing.toString()
      );

      if (!filteredBids.length) {
        return resolve({
          success: false,
          err: 1,
          msg: "Người dùng không tham gia đấu giá sản phẩm này.",
          status: 404,
        });
      }

      const sortedBids = filteredBids.sort((a, b) => b.bidPrice - a.bidPrice);

      resolve({
        success: true,
        err: 0,
        msg: "Lấy chi tiết lịch sử đấu giá thành công.",
        status: 200,
        response: {
          productDetails: {
            id: product._id,
            productName: product.product_name,
            slug: productSlug,
          },
          userBiddingDetails: sortedBids.map(bid => ({
            auctionRoundId: bid.auctionRound._id,
            bidPrice: bid.bidPrice,
            bidTime: bid.bidTime,
          })),
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
