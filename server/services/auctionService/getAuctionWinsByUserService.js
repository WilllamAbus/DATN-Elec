const AuctionWinner = require('../../model/productAuction/auctionWinner');

const getAuctionWinsByUserService = async (userId, page = 1, limit = 10, confirmationStatus = 'pending') => {
  const query = { user: userId };
  const skip = (page - 1) * limit;

  const total = await AuctionWinner.countDocuments(query);
  const auctionWins = await AuctionWinner.find(query)
    .populate({
      path: 'auctionPricingRange',
      populate: {
        path: 'product_randBib',
        select: 'product_name'
      }
    })
    .populate('auctionRound user')
    .skip(skip)
    .limit(limit);

  const currentTime = new Date().getTime();

  for (const auction of auctionWins) {
    if (new Date(auction.endTime).getTime() < currentTime && auction.confirmationStatus === 'pending') {
      auction.confirmationStatus = 'canceled';
      auction.auctionStatus = 'canceled';
      auction.auctionStausCheck = 'Đã duyệt hủy chiến thắng';
      await auction.save();
    }
  }

  const filteredAuctionWins = auctionWins.filter(auction => auction.confirmationStatus === confirmationStatus);

  const totalPages = Math.ceil(filteredAuctionWins.length / limit);

  return {
    data: filteredAuctionWins.slice(0, limit), 
    pagination: {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  getAuctionWinsByUserService,
};
