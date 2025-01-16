const AuctionPriceHistory = require('../../../../model/productAuction/auctionPriceHistory');
const AuctionWinner = require('../../../../model/productAuction/auctionWinner');
const { convertToLocalTime } = require('../../../../utils/timeConverter');

module.exports = async (auctionPricingRange, auctionRound) => {
  const winner = await AuctionPriceHistory.findOne({
    auctionPricingRange: auctionPricingRange._id,
    bidPrice: auctionPricingRange.maxPrice,
    status: { $ne: 'disabled' } 
  }).sort({ bidPrice: -1 });

  const currentTime = new Date();
  const temporaryEndTime = new Date(currentTime.getTime() + 30 * 60 * 1000); 

  if (winner) {
    const existingAuctionWinner = await AuctionWinner.findOne({
      user: winner.user,
      auctionPricingRange: auctionPricingRange._id,
      status: 'disabled'  
    });

    if (!existingAuctionWinner) {
      const remainingTime = calculateRemainingTime(temporaryEndTime);

      const auctionWinner = new AuctionWinner({
        user: winner.user,
        auctionPricingRange: auctionPricingRange._id,
        bidPrice: winner.bidPrice,
        bidTime: winner.bidTime,
        auctionRound: auctionRound._id,
        auctionStatus: 'temporary',
        startTime: convertToLocalTime(currentTime),
        endTime: convertToLocalTime(temporaryEndTime),
        remainingTime: remainingTime, 
        product_randBib: auctionPricingRange.product_randBib,
        notWinner: true,
      });
      await auctionWinner.save();


      auctionPricingRange.startTime = auctionWinner.startTime;
      auctionPricingRange.endTime = auctionWinner.endTime;
      auctionPricingRange.status = 'temporary';
      await auctionPricingRange.save();
    }
  }
};


function calculateRemainingTime(endTime) {
  const currentTime = new Date().getTime();
  const remainingTime = endTime.getTime() - currentTime;
  
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return remainingTime > 0 
    ? `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây` 
    : "Đã kết thúc";
}
