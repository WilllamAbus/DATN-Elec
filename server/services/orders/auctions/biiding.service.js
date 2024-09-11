'use strict'
/**Model */
const Bidding = require('../../../model/orders/bidding.model'); // Model Bidding đã được định nghĩa
const Product_v2 = require('../../../model/product_v2'); // Model sản phẩm
const PriceRangeBid = require('../../../model/orders/priceRange.model'); // Model PriceRangeBid
const Time_Track = require('../../../model/time-track.model')

/** */

const moment = require('moment-timezone');

const biddingService = {
   createBid : async (productId, userId,  bidAmount) => {
    try {
        // Find product and only get necessary fields
        const product = await Product_v2.findById({ _id: productId, status: { $ne: "disable" } })
          .select('product_name product_price_unit product_format')
          .populate('product_format', 'formats')
          .lean();
        
        if (!product) {
          throw new Error('Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa.');
        }
        
        // Check if product_format exists and get format
        const format = product.product_format.formats.trim();
        if (format !== "Đấu giá") {
          return null;
        }
      
        // Find priceRangeBid and only get necessary fields
        const priceRangeBid = await PriceRangeBid.findOne({ 'product_randBib.productId': productId })
          .select('minBid midBid maxBid')
          .lean();
    
        if (!priceRangeBid) {
          throw new Error('Không tìm thấy thông tin giá thầu cho sản phẩm.');
        }
    
        const { minBid, midBid, maxBid } = priceRangeBid;

        // Điều chỉnh lại công thức để tính maxAllowedBid với 7% thay vì 10%
        const maxAllowedBid = minBid + (minBid * 0.07); // 7% above minBid
        
        // Chuyển đổi bidAmount sang kiểu số
        const bidAmountNumber = Number(bidAmount);
        
        // Kiểm tra xem bidAmount có hợp lệ không
        if (bidAmount === undefined || bidAmount === null || isNaN(bidAmountNumber)) {
          throw new Error(`Giá đấu giá phải được cung cấp.`);
        }
        
        // Kiểm tra nếu bidAmountNumber không phải là minBid, midBid, maxBid 
        // và không nằm trong phạm vi từ minBid đến maxAllowedBid
        if (![minBid, midBid, maxBid].includes(bidAmountNumber) && !(bidAmountNumber > minBid && bidAmountNumber <= maxAllowedBid)) {
          throw new Error(`Giá đấu giá phải là ${minBid}, ${midBid}, ${maxBid}, hoặc không vượt quá 7% giá trị minBid (${maxAllowedBid.toFixed(2)}).`);
        }
        
    
        // Find timeTrack
        const timeTrack = await Time_Track.findOne({ productId })
          .select('_id')
          .lean();
    
        if (!timeTrack) {
          throw new Error('Không tìm thấy thông tin thời gian đấu giá.');
        }
        
        // Get current time in HCM timezone
        const bidTimeHCM = moment().tz('Asia/Ho_Chi_Minh').toDate();
    
        // Create and save new bid
        const newBid = new Bidding({
          product_bidding: {
            productId: product._id,
            product_name: product.product_name,
          },
          bidder: userId,
          bidAmount: bidAmountNumber,
          priceRange: priceRangeBid._id,
          bidTime: bidTimeHCM,
          stateBidding: 'Xử lý',
          bidEndTime: timeTrack._id,
          auctionId: null, 
        });
    
        return await newBid.save();
      } catch (error) {
        console.error('Error creating bid:', error.message);
        throw new Error(`Không thể tạo đấu giá: ${error.message}`);
      }
      },
      updateBidAmountService : async (userId, productId, bidAmount) => {
        try {
            // Step 1: Check if the product exists and is not disabled
            const product = await Product_v2.findOne({ _id: productId, status: { $ne: "disable" } })
                .select('product_name product_price_unit product_format')
                .populate('product_format', 'formats')
                .lean();
    
            if (!product) {
                throw new Error('Sản phẩm không tồn tại hoặc đã bị vô hiệu hóa.');
            }
    
            // Step 2: Check if product_format is "Đấu giá"
            const format = product.product_format.formats.trim();
            if (format !== "Đấu giá") {
                return null; // Not an auction product, no update needed
            }
    
            // Step 3: Find price range for bidding
            const priceRangeBid = await PriceRangeBid.findOne({ 'product_randBib.productId': productId })
                .select('minBid midBid maxBid')
                .lean();
    
            if (!priceRangeBid) {
                throw new Error('Không tìm thấy thông tin giá thầu cho sản phẩm.');
            }
    
            const { minBid, midBid, maxBid } = priceRangeBid;
            const maxAllowedBid = minBid + (minBid * 0.1); // 10% above minBid
    
            // Step 4: Convert bidAmount to a number and validate
            const bidAmountNumber = Number(bidAmount);
    
            if (bidAmount === undefined || bidAmount === null || isNaN(bidAmountNumber)) {
                throw new Error(`Giá đấu giá phải được cung cấp.`);
            }
    
            // Step 5: Validate if bidAmount is within the allowed range
            if (![minBid, midBid, maxBid].includes(bidAmountNumber) &&
                !(bidAmountNumber > minBid && bidAmountNumber <= maxAllowedBid)) {
                throw new Error(`Giá đấu giá phải là ${minBid}, ${midBid}, ${maxBid}, hoặc không vượt quá 10% giá trị minBid (${maxAllowedBid.toFixed(2)})`);
            }
       // Find timeTrack
       const timeTrack = await Time_Track.findOne({ productId })
       .select('_id')
       .lean();
 
     if (!timeTrack) {
       throw new Error('Không tìm thấy thông tin thời gian đấu giá.');
     }
     
     // Get current time in HCM timezone
     const bidTimeHCM = moment().tz('Asia/Ho_Chi_Minh').toDate();
            // Step 6: Update the bid amount in the Bidding model, filter by userId and productId
            const updatedBid = await Bidding.findOneAndUpdate(
                { 'product_bidding.productId': productId }, // Filter by productId and userId
                { $set: {
                    
                     product_bidding: {
                        productId: product._id,
                        product_name: product.product_name,
                      },
                      bidder: userId,
                      bidAmount: bidAmountNumber,
                      priceRange: priceRangeBid._id,
                      bidTime: bidTimeHCM,
                      stateBidding: 'Xử lý',
                      bidEndTime: timeTrack._id,
                      auctionId: null, 
                    } },   // Update bidAmount
                                          // Return updated document
            );
    
            return updatedBid;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    getBidsByUser : async (userId) => {
      try {
        const query = {
          bidder: userId,
          status: { $ne: 'disable' },
          stateBidding: 'Xử lý' // Lọc theo stateBidding
        };
      
        
          const bids = await Bidding.find(query)
              .populate('product_bidding.productId', 
                'product_name product_price_unit image') // Populate product info including image array
              .populate('priceRange', 'minBid midBid maxBid')
              .populate('bidEndTime', 'endTimeBid') // Populate price range info
              .sort({ bidTime: -1 }) // Sort by the most recent bid time
              .lean();
          
                
              return {
                totalBids: bids.length, // Use bids.length here
                bids,
            };
      } catch (error) {
          console.error('Error fetching bids by user:', error.message);
          throw new Error(`Không thể lấy danh sách lượt đấu giá của người dùng: ${error.message}`);
      }
  },
    updateBiddingAuctionId : async (oldAuctionId, newAuctionId) => {
        try {
          await Bidding.updateOne(
            { auctionId: oldAuctionId }, // Tìm các lượt đấu giá liên kết với phiên đấu giá cũ
            { $set: { auctionId: newAuctionId } } // Cập nhật các lượt đấu giá với auctionId mới
          );
          console.log('Updated bidding documents successfully.');
        } catch (error) {
          console.error('Error updating bidding documents:', error.message);
          throw new Error(`Không thể cập nhật lượt đấu giá: ${error.message}`);
        }
      },


      getAllBids: async (page = 1, limit = 5) => {
        try {
            const skip = (page - 1) * limit;
            const totalBids = await Bidding.countDocuments({ status: { $ne: 'disable' } });
            const bids = await Bidding.find({ status: { $ne: 'disable' } })
                .skip(skip)
                .limit(limit)
                .lean();

            return {
                totalBids,
                bids,
                totalPages: Math.ceil(totalBids / limit),
                currentPage: page
            };
        } catch (error) {
            console.error('Error fetching bids:', error.message);
            throw new Error(`Không thể lấy danh sách lượt đấu giá: ${error.message}`);
        }
    },

    getBidById: async (bidId) => {
        try {
            const bid = await Bidding.findById(bidId)
                .where('status').ne('disable') // Ensure the bid is not disabled
                .lean();

             
                
            if (!bid) {
                throw new Error('Không tìm thấy lượt đấu giá với ID này.');
            }

            return bid;
        } catch (error) {
            console.error('Error fetching bid by ID:', error.message);
            throw new Error(`Không thể lấy lượt đấu giá: ${error.message}`);
        }
    },

    softDeleteBid: async (bidId) => {
        try {
          const nowUtc = new Date();
    
          // Chuyển đổi thời gian UTC về múi giờ Việt Nam
          // Múi giờ Việt Nam là UTC + 7 giờ
          const offset = 7 * 60 * 60 * 1000; // 7 giờ tính bằng mili giây
          const now = new Date(nowUtc.getTime() + offset);
            const result = await Bidding.findByIdAndUpdate(bidId, { status: 'disable',  disabledAt: now }, { new: true });
        
          
            if (!result) {
                throw new Error('Không thể cập nhật trạng thái của lượt đấu giá.');
            }

            return result;
        } catch (error) {
            console.error('Error soft deleting bid:', error.message);
            throw new Error(`Không thể xóa lượt đấu giá: ${error.message}`);
        }
    },

    deleteBids: async (bidIds) => {
        try {
            const result = await Bidding.deleteMany({ _id: { $in: bidIds } });

            if (result.deletedCount === 0) {
                throw new Error('Không có lượt đấu giá nào được xóa.');
            }

            return result;
        } catch (error) {
            console.error('Error deleting multiple bids:', error.message);
            throw new Error(`Không thể xóa nhiều lượt đấu giá: ${error.message}`);
        }
    },

    restoreBid: async (bidId) => {
      try {
          const result = await Bidding.findByIdAndUpdate(bidId, { status: 'active' }, { new: true });

          if (!result) {
              throw new Error('Không thể khôi phục trạng thái của lượt đấu giá.');
          }

          return result;
      } catch (error) {
          console.error('Error restoring bid:', error.message);
          throw new Error(`Không thể khôi phục lượt đấu giá: ${error.message}`);
      }
  },
  getSoftDeletedBids: async (page = 1, limit = 5) => {
    try {
        const skip = (page - 1) * limit;
        const totalBids = await Bidding.countDocuments({ status: 'disable' });
        const bids = await Bidding.find({ status: 'disable' })
            .skip(skip)
            .limit(limit)
            .lean();

        return {
            totalBids,
            bids,
            totalPages: Math.ceil(totalBids / limit),
            currentPage: page
        };
    } catch (error) {
        console.error('Error fetching soft-deleted bids:', error.message);
        throw new Error(`Không thể lấy danh sách lượt đấu giá đã xóa mềm: ${error.message}`);
    }
}
}

module.exports=  biddingService