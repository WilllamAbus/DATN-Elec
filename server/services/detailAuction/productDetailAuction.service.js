const ProductAuction = require('../../model/productAuction/productAuction');
const ViewHistory = require('../../model/product_v2/viewHistory');
const AuctionPricingRange = require('../../model/productAuction/auctionPricingRange');

const ProductDetailService = {
  getProductDetailAuction: async (slug, userId) => {
    try {
      const query = { slug: slug, status: { $ne: 'disable' } };
      const productAuction = await ProductAuction.findOne(query)
        .populate('product_type')
        .populate('product_brand')
        .populate('product_condition')
        .populate('product_supplier')
        .populate('auctionPricing'); 

      if (!productAuction) {
        return {
          success: false,
          err: 1,
          msg: 'Không tìm thấy sản phẩm',
          status: 200,
        };
      }

      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

      if (userId) {
        const viewHistoryEntry = await ViewHistory.findOne({
          user: userId,
          productAuction: productAuction._id,
        });

        if (!viewHistoryEntry || viewHistoryEntry.lastViewed < tenMinutesAgo) {
          if (viewHistoryEntry) {
            viewHistoryEntry.viewCount += 1;
            viewHistoryEntry.lastViewed = now;
            await viewHistoryEntry.save();
          } else {
            await ViewHistory.create({
              user: userId,
              productAuction: productAuction._id,
              viewCount: 1,
              lastViewed: now,
            });
          }
          await ProductAuction.findByIdAndUpdate(productAuction._id, {
            $inc: { viewCount: 1 },
          });
        }
      } else {
        const productAuctionEntry = await ProductAuction.findById(productAuction._id);
        if (!productAuctionEntry.lastViewed || productAuctionEntry.lastViewed < tenMinutesAgo) {
          await ProductAuction.findByIdAndUpdate(productAuction._id, {
            $inc: { viewCount: 1 },
            lastViewed: now,
          });
        }
      }

      // Tính toán remainingTime cho auctionPricing
      const currentTime = new Date().getTime();
      if (productAuction.auctionPricing) {
        const auction = productAuction.auctionPricing;
        const endTime = new Date(auction.endTime).getTime();
        const remainingTime = endTime - currentTime;
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        auction.remainingTime = remainingTime > 0
          ? `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`
          : "Đã kết thúc";
      }

      return {
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        data: productAuction,
      };
    } catch (error) {
      return {
        success: false,
        err: -1,
        msg: 'Error: ' + error.message,
        status: 500,
      };
    }
  },
};

module.exports = ProductDetailService;
