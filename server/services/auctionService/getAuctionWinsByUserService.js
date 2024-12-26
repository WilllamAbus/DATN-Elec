const AuctionWinner = require('../../model/productAuction/auctionWinner');

const getAuctionWinsByUserService = async (userId, page = 1, limit = 10, confirmationStatus = 'pending') => {
  const query = { user: userId };
  const skip = (page - 1) * limit;

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


  const filteredAuctionWins = auctionWins.filter(auction => auction.confirmationStatus === confirmationStatus);

  const total = filteredAuctionWins.length;

  const totalPages = Math.ceil(total / limit);

  return {
    data: filteredAuctionWins.slice(0, limit), 
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
