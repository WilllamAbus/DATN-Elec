"use strict";
/**Module */
const mongoose = require('mongoose');
const moment = require("moment-timezone");
const Product_v2 = require("../../../model/product_v2");
const Auction = require("../../../model/orders/auction.model");
const TimeTrack = require("../../../model/time-track.model");
const Bidding = require("../../../model/orders/bidding.model");
const User = require("../../../model/users.model");
const auctionService = {
  completeAuction: async (productId, timeTrackID) => {
    // Xác minh sản phẩm và định dạng đấu giá
    const product = await Product_v2.findById({
      _id: productId,
      status: { $ne: "disable" },
    })
      .select("product_name product_format")
      .populate("product_format", "formats")
      .lean();

    
      
    if (!product) {
      throw new Error("Không tìm thấy sản phẩm hoặc sản phẩm đã bị vô hiệu hóa.");
    }

    const format = product.product_format?.formats?.trim();
    if (format !== "Đấu giá") {
      throw new Error('Sản phẩm không thuộc định dạng "Đấu giá".');
    }

    // Tìm kiếm thông tin thời gian từ TimeTrack
    const timeTrack = await TimeTrack.findById(timeTrackID).lean();
    if (!timeTrack) {
      throw new Error("Không tìm thấy thông tin thời gian đấu giá.");
    }
  // Kiểm tra nếu productId trong timeTrack khớp với productId từ request


    const currentTime = moment().tz("Asia/Ho_Chi_Minh").toDate();
    const bidEndTime = timeTrack._id

    // Cập nhật trạng thái đấu giá
    const updatedBiddings = await Bidding.find({
      "product_bidding.productId": productId,
      bidEndTime: { $eq: bidEndTime }, // Sử dụng endTimeBid để xác định đúng phiên đấu giá
    }).lean();

   
  

    if (updatedBiddings.length === 0) {
      throw new Error("Không có lượt đấu giá nào để cập nhật.");
    }

    await Bidding.updateMany(
      { _id: { $in: updatedBiddings.map((bid) => bid._id) } },
      { $set: { stateBidding: "Tiến hành thanh toán", bidTime: currentTime } }
    );

    // Tìm kiếm hoặc tạo mới Auction
    let auctionTemp = await Auction.findOne({ productId, auctionEndTime: timeTrackID }); // Tìm kiếm theo productId và timeTrackID
  

    if (!auctionTemp) {
      auctionTemp = new Auction({
        productId: productId,
        auction_winner: null,
        auction_quantity: 0,
        auction_total: 0,
        auctionTime: currentTime,
        auctionEndTime: timeTrackID, // Set auctionEndTime to timeTrackID
        biddings: [],
      });
    }

    // Add biddings and save auction
    auctionTemp.biddings.push(...updatedBiddings.map((bid) => bid._id));
    await auctionTemp.save();

    // Kiểm tra thời gian và tìm người chiến thắng
    const auctionEndTime = moment(auctionTemp.auctionTime).add(timeTrack.duration, "minutes");
   

    if (moment(currentTime).isSameOrAfter(auctionEndTime)) {
      const biddings = await Bidding.find({
        "product_bidding.productId": productId,
        bidEndTime: { $eq: bidEndTime }, // Chỉ xét các biddings trong khoảng thời gian này
      })
        .sort({ bidAmount: -1 })
        .lean();


      if (biddings.length === 0) {
        throw new Error("Không có giá đấu nào cho phiên đấu giá này.");
      }

      const highestBid = biddings[0];
 

      const updatedAuction = await Auction.findOneAndUpdate(
        { productId, auctionEndTime: timeTrackID },
        {
          $set: {
            auction_winner: highestBid.bidder,
            auction_total: highestBid.bidAmount,
            auction_quantity: 1,
            stateAuction: "Xác nhận",
            isActive: true,
            auctionTime: currentTime,
            biddings: auctionTemp.biddings,
          },
        },
        { new: true }
      ).lean();

      if (!updatedAuction) {
        throw new Error("Không thể cập nhật đấu giá.");
      }

    //      // Cập nhật trạng thái sản phẩm thành "disable"
    // await Product_v2.findByIdAndUpdate(productId, {
    //   status: "disable",
    // });

    // // Cập nhật trạng thái của các bản ghi trong priceRandBid và timeTrack thành "disable"
    // await PriceRandBid.updateMany(
    //   { productId },
    //   { $set: { status: "disable" } }
    // );
    // await TimeTrack.findByIdAndUpdate(timeTrackID, {
    //   status: "disable",
    // });
      return updatedAuction;

    } else {
      throw new Error("Đấu giá chưa kết thúc hoặc chưa đến thời điểm xác nhận.");
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
  getAuctionDetails: async (productId) => {
    try {
      // Retrieve the auction based on userId
      const auction = await Auction.findOne({ "productId": productId })
        .select("auction_total auction_quantity auction_winner productId auctionTime auctionEndTime biddings stateAuction")
        .lean();
      
      
      if (!auction) {
        throw new Error("Không thể tìm thấy đấu giá cho người dùng này.");
      }
  
  
      const biddings = auction.productId;
    const userId = auction.auction_winner
       
      const product = await Product_v2.findOne({"_id": biddings})
      .select("product_name image")
      .lean();
  
      
    if (!product) {
      console.warn(`Product not found for productId: ${biddings}`);
      throw new Error("Không tìm thấy sản phẩm.");
    }
  
    const user = await User.findById(userId)
          .select("address name phone")
          .lean();
  
        if (!user) {
          throw new Error("Không thể tìm thấy người dùng.");
        }
      // If each bidding contains a productId, query for product details
  
        
      return {
        auctionId: auction._id,
        auctionTotal: auction.auction_total,
        auctionQuantity: auction.auction_quantity,
        productName: product.product_name,
        productImages: product.image,
        userAddress: user.address,
        userName: user.name,
        userSdt: user.phone,
        auctionTime: auction.auctionTime,
        auctionEndTime: auction.auctionEndTime,
        biddings: biddings,
        stateAuction: auction.stateAuction
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
      console.error("Error fetching soft-deleted auctions:", error.message);
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
