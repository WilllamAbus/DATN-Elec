
const mongoose = require('mongoose');
const getDiscountFilter = (minDiscountPercent, maxDiscountPercent) => {
  const discountFilter = {};
  if (minDiscountPercent !== undefined) {
    discountFilter['product_discount.discountPercent'] = { ...discountFilter['product_discount.discountPercent'], $gte: parseFloat(minDiscountPercent) };
  }
  if (maxDiscountPercent !== undefined) {
    discountFilter['product_discount.discountPercent'] = { ...discountFilter['product_discount.discountPercent'], $lte: parseFloat(maxDiscountPercent) };
  }
  return discountFilter;
};
module.exports = getDiscountFilter;