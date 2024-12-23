const AuctionPricingRange = require('../../../model/productAuction/auctionPricingRange');
const AuctionPriceHistory = require('../../../model/productAuction/auctionPriceHistory');
const UserBidPrice = require('../../../model/productAuction/userBidPrice');
const ProductAuction = require('../../../model/productAuction/productAuction');
const AuctionRound = require('../../../model/productAuction/auctionRound');
const UserAuctionHistory = require('../../../model/productAuction/userAuctionHistory');

const createOneUpdateBidAuction = async (req, res) => {
  const { bidPrice } = req.body; // Get bid price from request body
  const { slug } = req.params; // Get slug from URL
  const userId = req.user ? req.user.id : null;

  // Check for missing parameters
  if (!slug || !userId || !bidPrice) {
    return res.status(400).json({
      success: false,
      err: 1,
      msg: 'Thiếu thông tin cần thiết (slug, userId, bidPrice)',
      status: 'error',
    });
  }

  try {
    // Find the auction product by slug
    const productAuction = await ProductAuction.findOne({ slug }).populate('auctionPricing');
    if (!productAuction) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Sản phẩm đấu giá không tồn tại',
        status: 'error',
      });
    }

    // Get auction pricing range from product auction
    const auctionPricingRange = productAuction.auctionPricing;
    if (!auctionPricingRange) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Không tìm thấy auctionPricingRange cho sản phẩm này',
        status: 'error',
      });
    }

    // Check auction status
    if (auctionPricingRange.status !== 'active') {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Sản phẩm không được đấu giá ở thời điểm này',
        status: 'error',
      });
    }

    // Ensure the bid price is higher than the current price
    if (bidPrice <= auctionPricingRange.currentPrice) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Giá đặt phải lớn hơn giá hiện tại',
        status: 'error',
      });
    }
    if (bidPrice > auctionPricingRange.maxPrice) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Giá đặt không được lớn hơn giá tối đa',
        status: 'error',
      });
    }
    // Update the current price in auction pricing range
    auctionPricingRange.currentPrice = bidPrice;
    auctionPricingRange.updatedAt = new Date(); // Update timestamp

    // Find or create the UserBidPrice record
    let userBidPrice = await UserBidPrice.findOne({ user: userId, auctionPricingRange: auctionPricingRange._id });

    if (!userBidPrice) {
      // If no existing bid found, create a new one
      userBidPrice = new UserBidPrice({
        user: userId,
        bidPrice,
        auctionPricingRange: auctionPricingRange._id,
      });
    } else {
      // If bid exists, update the bid price
      userBidPrice.bidPrice = bidPrice;
      userBidPrice.updatedAt = new Date(); // Update timestamp
    }

    await userBidPrice.save(); // Save the UserBidPrice record

    // Find the auction round associated with the auction pricing
    let auctionRound = await AuctionRound.findOne({ auctionPricing: auctionPricingRange._id });

    if (!auctionRound) {
      // If no auction round exists, create a new one
      auctionRound = new AuctionRound({
        auctionPricing: auctionPricingRange._id,
        participants: [userId],
        bids: [{ user: userId, bidPrice, bidTime: new Date() }],
      });
    } else {
      // If auction round exists, update participants and bids
      if (!auctionRound.participants.includes(userId)) {
        auctionRound.participants.push(userId); // Add user if not already in participants
      }
      const existingBid = auctionRound.bids.find(bid => bid.user.toString() === userId.toString());
      if (existingBid) {
        existingBid.bidPrice = bidPrice; // Update bid price for the existing user
        existingBid.bidTime = new Date(); // Update bid time
      } else {
        auctionRound.bids.push({ user: userId, bidPrice, bidTime: new Date() }); // Add new bid if not found
      }
      auctionRound.updatedAt = new Date(); // Update round timestamp
    }

    // Save auction round
    await auctionRound.save();

    // Handle AuctionPriceHistory: Create or update based on existing entry
    let auctionPriceHistory = await AuctionPriceHistory.findOne({
      auctionPricingRange: auctionPricingRange._id,
      user: userId,
    });

    if (!auctionPriceHistory) {
      // Create new entry if not found
      auctionPriceHistory = new AuctionPriceHistory({
        auctionPricingRange: auctionPricingRange._id,
        auctionRound: auctionRound._id,  // Update with the auction round ID
        user: userId,
        bidPrice,
        bidTime: new Date(),
      });
    } else {
      // Update existing entry
      auctionPriceHistory.bidPrice = bidPrice;
      auctionPriceHistory.bidTime = new Date();
    }

    // Save AuctionPriceHistory
    await auctionPriceHistory.save();

    // Save updated auctionPricingRange
    auctionPricingRange.auctionPriceHistory = auctionPriceHistory._id;  // Add the auctionPriceHistory ID to the auctionPricingRange
    await auctionPricingRange.save();

    // Now update the UserAuctionHistory
    let userAuctionHistory = await UserAuctionHistory.findOne({ user: userId });

    if (!userAuctionHistory) {
      // Create a new history record if none exists
      userAuctionHistory = new UserAuctionHistory({
        user: userId,
        bids: [{
          auctionRound: auctionRound._id,
          bidPrice,
          bidTime: new Date(),
        }],
      });
    } else {
      // Update the bids array if user history exists
      userAuctionHistory.bids.push({
        auctionRound: auctionRound._id,
        bidPrice,
        bidTime: new Date(),
      });
    }

    // Save the user's auction history
    await userAuctionHistory.save();
    if (bidPrice === auctionPricingRange.maxPrice) {
      // Thêm thông báo người dùng đã chiến thắng
      return res.status(200).json({
        success: true,
        err: 0,
        msg: 'Đã đặt giá thành công. Bạn đã chiến thắng sản phẩm đấu giá này!',
        status: 'success',
      });
    }
    // Return success response
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Đã đặt giá thành công',
      status: 'success',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Đã xảy ra lỗi khi đặt giá',
      status: 'error',
      error,
    });
  }
};

module.exports = { createOneUpdateBidAuction };
