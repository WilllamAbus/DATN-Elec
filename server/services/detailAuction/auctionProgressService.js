const AuctionPriceHistory = require("../../model/productAuction/auctionPriceHistory");
const ProductAuction = require("../../model/productAuction/productAuction");
const mongoose = require('mongoose');

const getAuctionProgressService = (slug, page, limit = 4) =>
  new Promise(async (resolve, reject) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const currentPage = page ? +page : 1;
      const offset = (!page || +page <= 1) ? 0 : (+page - 1) * limit;

      const product = await ProductAuction.findOne({ slug })
        .populate({
          path: "auctionPricing",
        })
        .session(session)
        .exec();

      if (!product || !product.auctionPricing) {
        await session.abortTransaction();
        session.endSession();
        return resolve({
          success: false,
          err: 1,
          msg: "Không tìm thấy phiên đấu giá tương ứng với slug.",
          status: 404,
        });
      }

      const auctionPricing = product.auctionPricing;

      const total = await AuctionPriceHistory.countDocuments({
        auctionPricingRange: auctionPricing._id,
        status: 'active',
      }).session(session);

      const biddingList = await AuctionPriceHistory.find({
        auctionPricingRange: auctionPricing._id,
        status: 'active',
      })
        .populate("user", "name")
        .sort({ bidPrice: -1 })
        .skip(offset)
        .limit(limit)
        .select("user bidPrice bidTime")
        .session(session);

      await session.commitTransaction();
      session.endSession();

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
            currentPage,
            totalPages: Math.ceil(total / limit),
            hasNextPage: currentPage < Math.ceil(total / limit),
            hasPrevPage: currentPage > 1,
          },
        },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      reject({
        success: false,
        err: -1,
        msg: "Đã xảy ra lỗi: " + error.message,
        status: 500,
      });
    }
  });

module.exports = { getAuctionProgressService };
