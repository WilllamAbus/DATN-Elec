const Discount = require('../../../../model/discount.model');

const calculateDiscountedPrice = async (productDiscountId, productPrice) => {
  try {
    const discount = await Discount.findById(productDiscountId);
    if (!discount) {
      throw new Error('Giảm giá không hợp lệ');
    }

    const discountPercent = parseFloat(discount.discountPercent) || 0;
    const discountAmount = (productPrice * discountPercent) / 100;
    const productPriceUnit = productPrice - discountAmount;

    return {
      productPriceUnit,
      discountPercent,
      discountAmount,
      discountInfo: discount 
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  calculateDiscountedPrice,
};
