const Discount = require('../../../../model/discount.model');

const calculateDiscount = async (discountId, productPrice) => {
  const discount = await Discount.findById(discountId);
  if (!discount) {
    throw new Error('Giảm giá không hợp lệ');
  }

  const discountPercent = parseFloat(discount.discountPercent) || 0;
  const discountAmount = (productPrice * discountPercent) / 100;
  const productPriceUnit = productPrice - discountAmount;

  return {
    discount,
    productPriceUnit
  };
};

module.exports = {
  calculateDiscount
};