module.exports = (auctionPricingRange, bidPrice, userId) => {
  const errors = [];

  // Chuyển đổi bidPrice sang số nguyên
  bidPrice = parseInt(bidPrice, 10);

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

  if (!Number.isInteger(bidPrice)) {
    errors.push('Giá đặt phải là số nguyên');
  }

  // Kiểm tra giá đặt có phải là bội số của 10,000
  if (bidPrice % 10000 !== 0) {
    errors.push('Giá đặt phải là bội số của 10,000');
  }

  return errors.length > 0 ? { errors, userId, auctionPricingRange } : null;
};
