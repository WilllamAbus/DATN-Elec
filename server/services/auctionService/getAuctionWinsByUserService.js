const AuctionWinner = require('../../model/productAuction/auctionWinner');

const getAuctionWinsByUserService = async (userId, page = 1, limit = 10, confirmationStatus = 'pending') => {
  const query = { 
    user: userId,
    confirmationStatus: confirmationStatus,
    auctionStatus: { $in: ['won', 'pending','temporary'] } 
  };
  const skip = (page - 1) * limit;

  const auctionWins = await AuctionWinner.find(query)
    .populate({
      path: 'auctionPricingRange',
      populate: {
        path: 'product_randBib',
        select: 'product_name'
      }
    })
    .populate({ path: 'auctionRound', select: 'auctionPricing participants bids status' })
    .populate({ path: 'user', select: 'name email avatar' })
    .skip(skip)
    .limit(limit);

  const currentTime = new Date().getTime();

  for (const auction of auctionWins) {
    if (new Date(auction.endTime).getTime() + (3 * 60 * 1000) < currentTime && auction.confirmationStatus === 'pending') {
      auction.confirmationStatus = 'canceled';
      auction.status = 'disabled';
      auction.auctionStatus = 'lose';
      auction.auctionStausCheck = 'Đã duyệt hủy chiến thắng';
      await auction.save();
    }

    const endTime = new Date(auction.endTime).getTime();
    const remainingTime = endTime - currentTime;
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    auction.remainingTime = remainingTime > 0 
      ? `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây` 
      : "Đã kết thúc";
  }

  const total = auctionWins.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: auctionWins.slice(0, limit), 
    pagination: {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    total
  };
};

module.exports = {
  getAuctionWinsByUserService,
};
