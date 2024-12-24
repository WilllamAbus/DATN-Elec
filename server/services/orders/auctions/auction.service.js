"use strict";
/**Module */
const mongoose = require("mongoose");
const cron = require("node-cron");
const moment = require("moment-timezone");
const Product_v2 = require("../../../model/productAuction/productAuction");
const Auction = require("../../../model/orders/auction.model");
const TimeTrack = require("../../../model/time-track.model");
const Bidding = require("../../../model/orders/bidding.model");
const User = require("../../../model/users.model");
const PriceRandBidder = require("../../../model/orders/priceRange.model");
// const { sendMail } = require("./mailForAuct");
const scheduelAuction = require("./crons/cronScheduleAuc");
const auctionService = {
  completeAuction: async (productId, timeTrackID) => {

    
    // Xác minh sản phẩm và định dạng đấu giá
    const product = await Product_v2.findById({
      _id: productId,
      status: { $ne: "disable" },
    })
      .select("product_name image")

      .lean();


    if (!product) {
      throw new Error(
        "Không tìm thấy sản phẩm hoặc sản phẩm đã bị vô hiệu hóa."
      );
    }

    // Tìm kiếm thông tin thời gian từ TimeTrack
    const timeTrack = await TimeTrack.findById(timeTrackID).lean();
    if (!timeTrack && timeTrack.status === "active") {
      throw new Error("Không tìm thấy thông tin thời gian đấu giá.");
    }
    // Kiểm tra nếu productId trong timeTrack khớp với productId từ request

    const currentTime = moment().tz("Asia/Ho_Chi_Minh").toDate();
    const bidEndTime = timeTrack._id;

    // Cập nhật trạng thái đấu giá
    const updatedBiddings = await Bidding.find({
      "product_bidding.productId": productId,
      bidEndTime: { $eq: bidEndTime },
      status: "active",
    })
      .select("bidder")
      .lean();
    const bidderComplte = updatedBiddings.map((bid) => bid.bidder);

    if (updatedBiddings.length === 0) {
      throw new Error("Không có lượt đấu giá nào để cập nhật.");
    }

    await Bidding.updateMany(
      { _id: { $in: updatedBiddings.map((bid) => bid._id) } },

      { $set: { stateBidding: "Tiến hành thanh toán", bidTime: currentTime } }
    );

    // Tìm kiếm hoặc tạo mới Auction
    let auctionTemp = await Auction.findOne({
      productId,
      auctionEndTime: timeTrackID,
      status: "active",
    }); // Tìm kiếm theo productId và timeTrackID

    if (!auctionTemp) {
      auctionTemp = new Auction({
        productId: productId,
        auction_winner: null,
        auction_quantity: 0,
        auction_total: 0,
        auctionTime: currentTime,
        emailSent: false, // Chỉ chọn những phiên đấu giá chưa gửi email
        auctionEndTime: timeTrackID, // Set auctionEndTime to timeTrackID
        biddings: [],
      });
    }

    // Add biddings and save auction
    auctionTemp.biddings.push(...updatedBiddings.map((bid) => bid._id));
    await auctionTemp.save();

    // Kiểm tra thời gian và tìm người chiến thắng
    const auctionEndTime = moment(auctionTemp.auctionTime).add(
      timeTrack.duration,
      "minutes"
    );

    if (moment(currentTime).isSameOrAfter(auctionEndTime)) {
      const biddings = await Bidding.find({
        "product_bidding.productId": productId,
        bidder: { $in: bidderComplte },
        bidEndTime: { $eq: bidEndTime },
        status: "active", // Chỉ xét các biddings trong khoảng thời gian này
      }).lean();
 
      
      if (biddings.length === 0) {
        throw new Error("Không có giá đấu nào cho phiên đấu giá này.");
      }
      const highestBid = biddings.reduce((maxBid, currentBid) => {
        return currentBid.bidAmount > maxBid.bidAmount ? currentBid : maxBid;
      });

    
      const highestBidPrice = highestBid.bidAmount;
      const winner = highestBid.bidder.toString();
      const winnerRef = highestBid.bidder

      
      // const highestBid = biddings[0];
      const remainingBids = biddings.filter(bid => bid.bidder !== winner);
      switch (true) {
    
        case biddings.length > 1:
          const groupedBids = remainingBids.reduce((acc, bid) => {
            acc[bid.bidAmount] = acc[bid.bidAmount] || [];
            acc[bid.bidAmount].push(bid);
            return acc;
          }, {});
   
          
        
          // Tìm các nhóm bid có cùng giá trị
          const commonBidGroups = Object.values(groupedBids).filter(group => group.length > 1);

        
          if (commonBidGroups.length > 0) {
            // Xử lý trường hợp có nhiều người cùng giá bid
            for (const group of commonBidGroups) {
              const earliestBid = group.reduce((earliest, currentBid) => {
                return new Date(currentBid.bidTime) < new Date(earliest.bidTime) ? currentBid : earliest;
              });
              
     
              
              const newWinner = earliestBid.bidder.toString();
              const newWinnerRef = earliestBid.bidder;
              const winningPriceCommom = earliestBid.bidAmount;
        
              // console.log('Trường hợp cùng giá bid - Người thắng:', newWinner, 'Giá:', winningPriceCommom);
        
              // Cập nhật cơ sở dữ liệu với winner mới
              await Auction.findOneAndUpdate(
                { productId, auctionEndTime: timeTrackID },
                {
                  $set: {
                    auction_winner: newWinner,
                    auctionUser: newWinnerRef,
                    auction_total: winningPriceCommom,
                    stateAuction: "Xác nhận",
                    isActive: true,
                    auction_quantity: 1,
                    auctionTime: currentTime,
                    biddings: auctionTemp.biddings,
                  },
                },
                { new: true }
              );
        
              await Bidding.updateMany(
                {
                  "product_bidding.productId": productId,
                  bidder: { $ne: newWinner },
                  bidEndTime: { $eq: bidEndTime },
                  status: "active",
                },
                {
                  $set: {
                    status: "disable",
                    stateBidding: "Lần sau",
                  },
                }
              );
        
              const userWinner = await User.findOne({
                _id: newWinner,
                status: "active",
              }).select("email").lean();
        
              const mailWinnerCommon = userWinner.email;
        
     
              const orderDetails = {
                product_name: product.product_name,
                product_image: product.image[0],
                amount: winningPriceCommom,
                winningTime: currentTime,
              };
            
              // Gửi email thông báo người chiến thắng
              // await sendMail(mailWinnerCommon, orderDetails);
            
              // Cập nhật trạng thái emailSent thành true sau khi đã gửi email
            
            
           
            }
          } else {
            // Xử lý trường hợp các giá bid khác nhau
            const highestBid = remainingBids.reduce((highest, current) => {
              return current.bidAmount > highest.bidAmount ? current : highest;
            });
            const newWinner = highestBid.bidder.toString();
            const newWinnerRef = highestBid.bidder;
            const winningPriceHids = highestBid.bidAmount;
            // console.log('Trường hợp giá bid khác nhau - Người thắng:', newWinner, 'Giá:', winningPriceHids);
            await Auction.findOneAndUpdate(
              { productId, auctionEndTime: timeTrackID },
              {
                $set: {
                  auction_winner: newWinner,
                  auctionUser: newWinnerRef,
                  auction_total: winningPriceHids,
                  stateAuction: "Xác nhận",
                  isActive: true,
                  auction_quantity: 1,
                  auctionTime: currentTime,
                  biddings: auctionTemp.biddings,
                },
              },
              { new: true }
            );
        
            await Bidding.updateMany(
              {
                "product_bidding.productId": productId,
                bidder: { $ne: newWinner },
                bidEndTime: { $eq: bidEndTime },
                status: "active",
              },
              {
                $set: {
                  status: "disable",
                  stateBidding: "Lần sau",
                },
              }
            );
        
            const userWinner = await User.findOne({
            _id: newWinner,
            status: "active",
           }).select("email").lean();
            const mailWinnerHigis = userWinner.email;
       
      
            // Cập nhật cơ sở dữ liệu với winner mới
      
            const orderDetails = {
              product_name: product.product_name,
              product_image: product.image[0],
              amount: winningPriceHids,
              winningTime: currentTime,
            };
        
            await sendMail(mailWinnerHigis, orderDetails);
          
            // Cập nhật trạng thái emailSent thành true sau khi đã gửi email
        
          }
          break;
        
    
        case biddings.length === 1:
          // Nếu không có thay đổi, giữ nguyên người chiến thắng hiện tại
          // Cập nhật trạng thái cho người chiến thắng và các bidding còn lại
          await Auction.findOneAndUpdate(
            { productId, auctionEndTime: timeTrackID },
            {
              $set: {
                auction_winner: winner,
                auctionUser: winnerRef,
                auction_total: highestBidPrice,
                stateAuction: "Xác nhận",
                isActive: true,  // Đấu giá đã kết thúc
                auctionTime: currentTime,
                auction_quantity: 1,
                biddings: auctionTemp.biddings, // Đấu giá đã kết thúc
              },
            },
            { new: true }
          );
          await Bidding.updateMany(
            {
              "product_bidding.productId": productId,
              bidder: { $ne: winner }, // Những người không phải là người chiến thắng
              bidEndTime: { $eq: bidEndTime },
              status: "active",
            },
           { new: true }
          );
          const winnerEmailCase = winner;
       
          const userWinnerCase = await User.findOne({
            _id: winnerEmailCase,
            status: "active",
          })
            .select("email")
            .lean();
    
          const mailWinnerCase = userWinnerCase.email;
     
          
          const orderDetailsCase = {
            product_name: product.product_name,
            product_image: product.image[0], // Thêm ảnh sản phẩm
            amount: highestBidPrice,
            winningTime: currentTime, // Thêm thời gian trúng đấu giá
          };
    
          await sendMail(mailWinnerCase, orderDetailsCase);
    
        
        
         
          break;
       
        default:
          // Trường hợp mặc định nếu không có thay đổi nào
          throw new Error("Có sự cố trong việc xử lý kết quả đấu giá.");
      }
      
      //      // Cập nhật trạng thái sản phẩm thành "disable"
      await Promise.all([
        Bidding.updateMany(
          { "product_bidding.productId": productId },
          { $set: { status: "disable" } }
        ),
        TimeTrack.findOneAndUpdate(
          { productId: productId },
          { $set: { status: "disable" } }
        ),
        PriceRandBidder.findOneAndUpdate(
          { "product_randBib.productId": productId },
          { $set: { status: "disable" } }
        ),
        Product_v2.findOneAndUpdate(
          { _id: productId },
          { $set: { status: "disable" } }
        )
      ]);
      
      const updatedAuction = await Auction.findOne({productId: productId, auctionEndTime: timeTrackID })
      // console.log('Updated', updatedAuction);
      ;
      return updatedAuction;
    } else {
      throw new Error(
        "Đấu giá chưa kết thúc hoặc chưa đến thời điểm xác nhận."
      );
    }
  },

  getAll: async (page = 1, limit = 5) => {
    try {
      const skip = (page - 1) * limit;
      const totalAuctions = await Auction.countDocuments({
        status: { $ne: "disable" },
      });
      const auctions = await Auction.find({ status: { $ne: "disable" } })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "auction_winner",
          select: "name ", // Fields to include from the User model
          model: User,
        })
        .lean();

      return {
        totalAuctions,
        auctions,
        totalPages: Math.ceil(totalAuctions / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error fetching auctions:", error.message);
      throw new Error(`Cannot fetch auctions: ${error.message}`);
    }
  },

  getById: async (auctionId) => {
    try {
      const auction = await Auction.findById(auctionId)
        .where("status")
        .ne("disable")
        .populate({
          path: "auction_winner",
          select: "email", // Fields to include from the User model
          model: User,
        })
        .populate({
          path: "productId",
          select: "product_name, image",
          model: Product_v2,
        })
        .lean();

      if (!auction) {
        throw new Error("Auction not found.");
      }

      return auction;
    } catch (error) {
      console.error("Error fetching auction by ID:", error.message);
      throw new Error(`Cannot fetch auction: ${error.message}`);
    }
  },
  updateAuctionStatus: async (productId) => {
    try {
      // Tìm và cập nhật trạng thái cho phiên đấu giá cụ thể
      const delayInMs = 30 * 60 * 1000; // 30 phút
      const auction = await Auction.findOneAndUpdate(
        {
          productId: productId, // Sử dụng productId
          status: "active",
          createdAt: { $lte: new Date(Date.now() - delayInMs) },
        },
        { $set: { status: "disabled" } },
        { new: true } // Trả về phiên đấu giá đã cập nhật
      );

      if (auction) {
        console.log(
          `Đã cập nhật phiên đấu giá với ID: ${auction._id} từ active sang disabled.`
        );
      } else {
        console.log(
          `Không tìm thấy phiên đấu giá nào để cập nhật cho productId: ${productId}`
        );
      }
    } catch (error) {
      console.error(
        `Lỗi trong quá trình cập nhật trạng thái đấu giá cho productId ${productId}:`,
        error.message
      );
    }
  },
  getAuctionDetailsV2: async (userId, productId ) => {
    try {
 
      const auctions = await Auction.find({
        auctionUser: userId
      })
        .select(
          "auction_total auction_quantity auction_winner productId auctionUser auctionTime auctionEndTime biddings stateAuction"
        )
        .lean();
      
      if (!auctions) {
        throw new Error("Không thể tìm thấy đấu giá cho người dùng này.");
      }
     
      const filteredAuctions = auctions.filter(auction => auction.productId.toString() === productId);

      
      if (filteredAuctions.length === 0) {
        throw new Error("Không thể tìm thấy đấu giá cho sản phẩm này.");
      }

      const product = await Product_v2.findOne({ _id: productId })
        .select("product_name image")
        .lean();

      if (!product) {
   
        throw new Error("Không tìm thấy sản phẩm.");
      }

      const user = await User.findOne({ _id: filteredAuctions[0].auctionUser })
      .select("addresses name phone")
      .lean();

    if (!user) {
      throw new Error("Không thể tìm thấy người dùng.");
    }

   
      // If each bidding contains a productId, query for product details
      const defaultAddress = user.addresses.find(address => address.isDefault);

      const addressName =defaultAddress.address
  
      
      return {
        auctionId: filteredAuctions[0]._id,
        auctionTotal: filteredAuctions[0].auction_total,
        auctionQuantity: filteredAuctions[0].auction_quantity,
        productName: product.product_name,
        productImages: product.image,
        userAddress:addressName,
        userName: user.name,
        userSdt: user.phone,
        auctionTime: filteredAuctions[0].auctionTime,
        auctionEndTime: filteredAuctions[0].auctionEndTime,
        biddings: filteredAuctions[0],
        stateAuction: filteredAuctions[0].stateAuction,
      };

      // Retrieve the product details

      // Return the auction details along with product and user details
    } catch (error) {
      console.error("Error fetching auction details:", error.message);
      throw new Error(`Cannot fetch auction details: ${error.message}`);
    }
  },
  getAuctionDetails: async (userId, productId ) => {
    try {
 
      const auctions = await Auction.find({
        auctionUser: userId
      })
        .select(
          "auction_total auction_quantity auction_winner productId auctionUser auctionTime auctionEndTime biddings stateAuction"
        )
        .lean();
      
      if (!auctions) {
        throw new Error("Không thể tìm thấy đấu giá cho người dùng này.");
      }
     
      const filteredAuctions = auctions.filter(auction => auction.productId.toString() === productId);

      
      if (filteredAuctions.length === 0) {
        throw new Error("Không thể tìm thấy đấu giá cho sản phẩm này.");
      }

      const product = await Product_v2.findOne({ _id: productId })
        .select("product_name image")
        .lean();

      if (!product) {
   
        throw new Error("Không tìm thấy sản phẩm.");
      }

      const user = await User.findOne({ _id: filteredAuctions[0].auctionUser })
      .select("addresses name phone")
      .lean();

    if (!user) {
      throw new Error("Không thể tìm thấy người dùng.");
    }

     

      
      if (!user) {
        throw new Error("Không thể tìm thấy người dùng.");
      }
      // If each bidding contains a productId, query for product details
      const defaultAddress = user.addresses.find(address => address.isDefault);

      const addressName =defaultAddress.address
  
      
      return {
        auctionId: filteredAuctions[0]._id,
        auctionTotal: filteredAuctions[0].auction_total,
        auctionQuantity: filteredAuctions[0].auction_quantity,
        productName: product.product_name,
        productImages: product.image,
        userAddress:addressName,
        userName: user.name,
        userSdt: user.phone,
        auctionTime: filteredAuctions[0].auctionTime,
        auctionEndTime: filteredAuctions[0].auctionEndTime,
        biddings: filteredAuctions[0],
        stateAuction: filteredAuctions[0].stateAuction,
      };

      // Retrieve the product details

      // Return the auction details along with product and user details
    } catch (error) {
      console.error("Error fetching auction details:", error.message);
      throw new Error(`Cannot fetch auction details: ${error.message}`);
    }
  },
  delete: async (auctionId) => {
    try {
      const result = await Auction.deleteOne({ _id: auctionId });

      if (result.deletedCount === 0) {
        throw new Error("No auction deleted.");
      }

      return result;
    } catch (error) {
      console.error("Error deleting auction:", error.message);
      throw new Error(`Cannot delete auction: ${error.message}`);
    }
  },

  softDelete: async (auctionId) => {
    try {
      const result = await Auction.findByIdAndUpdate(
        auctionId,
        { status: "disable" },
        { new: true }
      );

      if (!result) {
        throw new Error("Cannot update auction status.");
      }

      return result;
    } catch (error) {
      console.error("Error soft deleting auction:", error.message);
      throw new Error(`Cannot soft delete auction: ${error.message}`);
    }
  },

  softDeleteList: async (query) => {
    try {
      const result = await Auction.updateMany(query, {
        $set: { status: "disable" },
      });

      if (result.nModified === 0) {
        throw new Error("No auctions soft-deleted with the provided query.");
      }

      return result;
    } catch (error) {
      console.error("Error soft deleting auctions with query:", error.message);
      throw new Error(`Cannot soft delete auctions: ${error.message}`);
    }
  },

  restore: async (auctionId) => {
    try {
      const result = await Auction.findByIdAndUpdate(
        auctionId,
        { status: "active" },
        { new: true }
      );

      if (!result) {
        throw new Error("Cannot restore auction status.");
      }

      return result;
    } catch (error) {
      console.error("Error restoring auction:", error.message);
      throw new Error(`Cannot restore auction: ${error.message}`);
    }
  },

  getSoftDeleted: async (page = 1, limit = 5) => {
    try {
      const skip = (page - 1) * limit;
      const totalAuctions = await Auction.countDocuments({ status: "disable" });
      const auctions = await Auction.find({ status: "disable" })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "auction_winner",
          select: "name ", // Fields to include from the User model
          model: User,
        })
        .lean();

      return {
        totalAuctions,
        auctions,
        totalPages: Math.ceil(totalAuctions / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Cannot fetch soft-deleted auctions: ${error.message}`);
    }
  },

  searchByWinnerName: async (name, page = 1, limit = 10) => {
    try {
      // Find users by name
      const users = await User.find({ name: new RegExp(name, "i") })
        .select("_id")
        .lean();
      if (users.length === 0) {
        return { auctions: [], total: 0 };
      }

      // Extract user IDs
      const userIds = users.map((user) => user._id);

      // Find auctions where auction_winner is one of the user IDs
      const auctions = await Auction.find({ auction_winner: { $in: userIds } })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "auction_winner",
          select: "name email", // Fields to include from the User model
          model: User,
        })
        .lean(); // Use lean() for performance

      const total = await Auction.countDocuments({
        auction_winner: { $in: userIds },
      }); // Get total count for pagination

      return { auctions, total };
    } catch (error) {
      console.error("Error searching auctions by winner name:", error.message);
      throw new Error(`Không thể tìm kiếm đấu giá: ${error.message}`);
    }
  },
};

module.exports = auctionService;
