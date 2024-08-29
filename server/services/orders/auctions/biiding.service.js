'use strict'
/**Model */
const Bidding = require('../../../model/orders/bidding.model'); // Model Bidding đã được định nghĩa
const Product_v2 = require('../../../model/product_v2'); // Model sản phẩm
const PriceRangeBid = require('../../../model/orders/priceRange.model'); // Model PriceRangeBid

/** */

const moment = require('moment-timezone');

const biddingService = {
    createBid:  async (productId, userId, bidInput) => {
        try {
          // Tìm sản phẩm và chỉ lấy các trường cần thiết, sử dụng lean() để giảm memory overhead
          const product = await Product_v2.findOne({ _id: productId, status: { $ne: "disable" } })
            .populate('product_format', 'formats')
            .select('product_name product_price_unit product_format')
            .lean();
      
            const format = product.product_format.formats.trim();

            if (format !== "Đấu giá") {
              return null;
            }
      
          // Tìm thông tin priceRangeBid chỉ lấy các trường cần thiết, sử dụng lean() để giảm memory overhead
          const priceRangeBid = await PriceRangeBid.findOne({ product_randBib: productId })
            .select('minBid midBid maxBid')
            .lean();
      
          if (!priceRangeBid) {
            throw new Error('Không tìm thấy thông tin giá thầu cho sản phẩm.');
          }
      
          const { minBid, midBid, maxBid } = priceRangeBid;
          const maxAllowedBid = minBid + (minBid * 0.1); // Tính giá trị lớn nhất được phép đấu giá
      
          // Kiểm tra giá trị nhập có hợp lệ không
          if (![minBid, midBid, maxBid].includes(bidInput) && !(bidInput > minBid && bidInput <= maxAllowedBid)) {
            throw new Error(`Giá đấu giá phải là ${minBid}, ${midBid}, ${maxBid}, hoặc không vượt quá 10% giá trị minBid (${maxAllowedBid.toFixed(2)})`);
          }
      
          // Lấy thời gian hiện tại theo múi giờ HCM
          const bidTimeHCM = moment().tz('Asia/Ho_Chi_Minh').toDate();
      
          // Tạo và lưu một lượt đấu giá mới
          const newBid = new Bidding({
            product_bidding: {
              productId: product._id,
              product_name: product.product_name,
            },
            bidder: userId,
            bidAmount: bidInput,
            priceRange: priceRangeBid._id,
            bidTime: bidTimeHCM,
        
          });
      
          return await newBid.save();
      
        } catch (error) {
          console.error('Error creating bid:', error.message);
          throw new Error(`Không thể tạo đấu giá: ${error.message}`);
        }
    },

    
}

module.exports=  biddingService