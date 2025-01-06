module.exports = (auctionPricingRange, bidPrice, userId) => {
  const errors = [];

  if (auctionPricingRange.status !== 'active') {
    errors.push('Sản phẩm không được đấu giá ở thời điểm này');
  }

  if (bidPrice <= auctionPricingRange.currentPrice) {
    errors.push('Giá đặt phải lớn hơn giá hiện tại');
  }
  if (bidPrice < auctionPricingRange.currentPrice + auctionPricingRange.priceStep) {
    errors.push('Giá đặt phải lớn hơn hoặc bằng bước giá');
  }
  

  if (bidPrice > auctionPricingRange.maxPrice) {
    errors.push('Giá đặt không được lớn hơn giá tối đa');
  }

  return errors.length > 0 ? { errors, userId, auctionPricingRange } : null;
};
