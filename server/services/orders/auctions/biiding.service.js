'use strict'
/**Model */
const Bidding = require('../../../model/orders/bidding.model'); // Model Bidding đã được định nghĩa
const Product_v2 = require('../../../model/productAuction/productAuction'); // Model sản phẩm
const PriceRangeBid = require('../../../model/orders/priceRange.model'); // Model PriceRangeBid
const Time_Track = require('../../../model/time-track.model')
const User = require('../../../model/users.model'); // Model User
/** */


const moment = require('moment-timezone');


const biddingService = {
   createBid : async (productId, userId,  bidAmount) => {
    try {
        // Find product and only get necessary fields
        const product = await Product_v2.findById({ _id: productId, status: { $ne: "disable" } })
          .select('product_name product_price_unit ')
       
          .lean();
        
      
      
        // Find priceRangeBid and only get necessary fields
        const priceRangeBid = await PriceRangeBid.findOne({ 'product_randBib.productId': productId })
          .select('minBid midBid maxBid')
          .lean();
    
        if (!priceRangeBid) {
          throw new Error('Không tìm thấy thông tin giá thầu cho sản phẩm.');
        }
    
        const { minBid, midBid, maxBid } = priceRangeBid;

        // Điều chỉnh lại công thức để tính maxAllowedBid với 7% thay vì 10%
        const maxAllowedBid = minBid + (minBid * 1.07); // 7% above minBid
        
        // Chuyển đổi bidAmount sang kiểu số
        const bidAmountNumber = Number(bidAmount);
        
        // Kiểm tra xem bidAmount có hợp lệ không
        if (bidAmount === undefined || bidAmount === null || isNaN(bidAmountNumber)) {
          throw new Error(`Giá đấu giá phải được cung cấp.`);
        }
        
        // Kiểm tra nếu bidAmountNumber không phải là minBid, midBid, maxBid 
        // và không nằm trong phạm vi từ minBid đến maxAllowedBid
       
        
    
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
                .select('product_name product_price_unit ')
        
                .lean();
    
          
    
            // Step 2: Check if product_format is "Đấu giá"
          
    
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
          status: 'active',
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
        
        } catch (error) {
          console.error('Error updating bidding documents:', error.message);
          throw new Error(`Không thể cập nhật lượt đấu giá: ${error.message}`);
        }
      },

 
      getAllBids: async (page = 1, pageSize = 10) => {
        try {
        
       
          // Bước 1: Tìm tất cả TimeTrack có status là 'active'
          const Biddings = await Bidding.find({status:'disable' })
            .select("_id product_bidding bidder bidAmount bidTime bidEndTime priceRange status") 
            .populate("product_bidding" ,"product_name", "productId") // Chỉ lấy các trường cần thiết từ TimeTrack
            .lean();
    
          
            
          // Bước 2: Lấy danh sách productId từ timeTracks
          const productIds = Biddings.map((bis) => bis.product_bidding.productId);
          const priceRandBids = Biddings.map((bidRand) =>bidRand.priceRange)
          const bidders = Biddings.map((bidUser) =>bidUser.bidder)
          const timeBiddings = Biddings.map((timeBiddings) => timeBiddings.bidEndTime)
          // Bước 3: Tìm các sản phẩm có _id nằm trong danh sách productIds
          const products = await Product_v2.find({
            _id: { $in: productIds },
          })
            .select("_id product_name image ")
          
            .lean();

            const priceRand = await PriceRangeBid.find({
              _id: { $in: priceRandBids },
            })
              .select("minBid midBid maxBid")
            
              .lean();


              const priceRandUSer = await User.find({
                _id: { $in: bidders },
              })
                .select("name")
              
                .lean();


                const biddingTime = await User.find({
                  _id: { $in: timeBiddings },
                })
                  .select("endTimeBid")
                
                  .lean();

               
    
  
          const productMap = {};
          const priceRandMap = {};
          const priceRandUserMap = {};
          const timeRandMap = {};
          products.forEach((product) => {
            productMap[product._id] = product;
          });

          priceRand.forEach((rand) => {
            priceRandMap[rand._id] = rand;
          });

          priceRandUSer.forEach((randUser) => {
            priceRandUserMap[randUser._id] = randUser;
          });

          biddingTime.forEach((randUserTime) => {
            timeRandMap[randUserTime._id] = randUserTime;
          });
    
          // Bước 5: Thêm thông tin sản phẩm vào timeTracks
          const matchedBidding = Biddings.map(ciddings => {
            const productIdStr = ciddings.product_bidding?.productId?.toString(); // Chuyển ObjectId thành chuỗi
            const product = productMap[productIdStr]; // Lấy thông tin sản phẩm từ productMap
            
            const randPrice = ciddings.priceRange.toString(); //
            const randPriceObj = priceRandMap[randPrice];
            
            
            const bidingUser = ciddings.bidder.toString()
            const biddingUserObj = priceRandUserMap[bidingUser]

            const bidngTime =  ciddings.bidEndTime.toString()
            const bidngTimeObj = timeRandMap[bidngTime]
            // Lấy thông tin giá trị đấu giá từ priceRandMap
            // Nếu sản phẩm tồn tại, kết hợp thông tin từ timeTrack và product
            if (product) {
              return {
                ...ciddings, // Thêm thông tin timeTrack
                product,
                randPriceObj,
                biddingUserObj,
                bidngTimeObj // Thêm thông tin sản phẩm
              };
            }
            return null; // Trả về null nếu không tìm thấy sản phẩm
          }).filter(track => track !== null); // Lọc các phần tử null
    
          // In ra kết quả
      
      
          
          // Lấy danh sách hình ảnh từ matchedTimeTracks
          const allBidding = matchedBidding.map(track => ({
            timeTrackId: track._id,
            productId: track.product._id,
            productName: track.product.product_name,
            image: track.product.image, // Lấy hình ảnh từ sản phẩm
            minBib: track.randPriceObj.minBib,
            midBid: track.randPriceObj.midBid,
            maxBid: track.randPriceObj.maxBid,
      
            biddingUserObj: track.biddingUserObj.name,
            // Lấy thông tin giá trị đấu giá từ priceRandMap
          }));
        
          
          // In ra danh sách hình ảnh
    
    
          // Bước 6: Áp dụng tìm kiếm (nếu có)
          const searchResults =  matchedBidding.filter((priceRange) => {
            const productName = priceRange.product_bidding.product_name.toLowerCase();
            return productName
          })
    
          // Bước 7: Phân trang
          const totalItems = searchResults.length; // Tổng số mục sau khi lọc
          const totalBuckets = Math.ceil(totalItems / pageSize); // Tổng số bucket
          const bucket = Math.min(totalBuckets, page); // Chỉ số bucket hiện tại
          const paginatedResults = searchResults.slice((bucket - 1) * pageSize, bucket * pageSize); // Lấy dữ liệu của bucket
      
          // Bước 8: Tính toán tổng số trang
          const totalPages = totalBuckets;
    
          return {
            Bidding: paginatedResults,
            totalPages: totalPages,
          currentPage: bucket,
          allBidding, // Trả về danh sách hình ảnh
          };
        } catch (error) {
          console.error(error);
          throw new Error(`Error retrieving : ${error.message}`);
        }
    },
    getAllBidsActive: async (page = 1, pageSize = 10) => {
      try {
      
     
        // Bước 1: Tìm tất cả TimeTrack có status là 'active'
        const Biddings = await Bidding.find({status:'active' })
          .select("_id product_bidding bidder bidAmount bidTime bidEndTime priceRange status") 
          .populate("product_bidding" ,"product_name", "productId") // Chỉ lấy các trường cần thiết từ TimeTrack
          .lean();
  
        
          
        // Bước 2: Lấy danh sách productId từ timeTracks
        const productIds = Biddings.map((bis) => bis.product_bidding.productId);
        const priceRandBids = Biddings.map((bidRand) =>bidRand.priceRange)
        const bidders = Biddings.map((bidUser) =>bidUser.bidder)
        const timeBiddings = Biddings.map((timeBiddings) => timeBiddings.bidEndTime)
        // Bước 3: Tìm các sản phẩm có _id nằm trong danh sách productIds
        const products = await Product_v2.find({
          _id: { $in: productIds },
        })
          .select("_id product_name image ")
        
          .lean();

          const priceRand = await PriceRangeBid.find({
            _id: { $in: priceRandBids },
          })
            .select("minBid midBid maxBid")
          
            .lean();


            const priceRandUSer = await User.find({
              _id: { $in: bidders },
            })
              .select("name")
            
              .lean();


              const biddingTime = await User.find({
                _id: { $in: timeBiddings },
              })
                .select("endTimeBid")
              
                .lean();

             
  

        const productMap = {};
        const priceRandMap = {};
        const priceRandUserMap = {};
        const timeRandMap = {};
        products.forEach((product) => {
          productMap[product._id] = product;
        });

        priceRand.forEach((rand) => {
          priceRandMap[rand._id] = rand;
        });

        priceRandUSer.forEach((randUser) => {
          priceRandUserMap[randUser._id] = randUser;
        });

        biddingTime.forEach((randUserTime) => {
          timeRandMap[randUserTime._id] = randUserTime;
        });
  
        // Bước 5: Thêm thông tin sản phẩm vào timeTracks
        const matchedBidding = Biddings.map(ciddings => {
          const productIdStr = ciddings.product_bidding?.productId?.toString(); // Chuyển ObjectId thành chuỗi
          const product = productMap[productIdStr]; // Lấy thông tin sản phẩm từ productMap
          
          const randPrice = ciddings.priceRange.toString(); //
          const randPriceObj = priceRandMap[randPrice];
          
          
          const bidingUser = ciddings.bidder.toString()
          const biddingUserObj = priceRandUserMap[bidingUser]

          const bidngTime =  ciddings.bidEndTime.toString()
          const bidngTimeObj = timeRandMap[bidngTime]
          // Lấy thông tin giá trị đấu giá từ priceRandMap
          // Nếu sản phẩm tồn tại, kết hợp thông tin từ timeTrack và product
          if (product) {
            return {
              ...ciddings, // Thêm thông tin timeTrack
              product,
              randPriceObj,
              biddingUserObj,
              bidngTimeObj // Thêm thông tin sản phẩm
            };
          }
          return null; // Trả về null nếu không tìm thấy sản phẩm
        }).filter(track => track !== null); // Lọc các phần tử null
  
        // In ra kết quả
    
    
        
        // Lấy danh sách hình ảnh từ matchedTimeTracks
        const allBiddingActive = matchedBidding.map(track => ({
          timeTrackId: track._id,
          productId: track.product._id,
          productName: track.product.product_name,
          image: track.product.image, // Lấy hình ảnh từ sản phẩm
          minBib: track.randPriceObj.minBib,
          midBid: track.randPriceObj.midBid,
          maxBid: track.randPriceObj.maxBid,
    
          biddingUserObj: track.biddingUserObj.name,
          // Lấy thông tin giá trị đấu giá từ priceRandMap
        }));
      
        
        // In ra danh sách hình ảnh
  
  
        // Bước 6: Áp dụng tìm kiếm (nếu có)
        const searchResults =  matchedBidding.filter((priceRange) => {
          const productName = priceRange.product_bidding.product_name.toLowerCase();
          return productName
        })
  
        // Bước 7: Phân trang
        const totalItems = searchResults.length; // Tổng số mục sau khi lọc
        const totalBuckets = Math.ceil(totalItems / pageSize); // Tổng số bucket
        const bucket = Math.min(totalBuckets, page); // Chỉ số bucket hiện tại
        const paginatedResults = searchResults.slice((bucket - 1) * pageSize, bucket * pageSize); // Lấy dữ liệu của bucket
    
        // Bước 8: Tính toán tổng số trang
        const totalPages = totalBuckets;
  
        return {
          biddingActive: paginatedResults,
          totalPageActive: totalPages,
        currentPageActive: bucket,
        allBiddingActive, // Trả về danh sách hình ảnh
        };
      } catch (error) {
        console.error(error);
        throw new Error(`Error retrieving : ${error.message}`);
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