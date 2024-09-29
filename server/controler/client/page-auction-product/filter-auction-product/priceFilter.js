const mongoose = require('mongoose');
const getPriceFilter = (minPrice, maxPrice) => {
  const priceFilter = {};
  if (minPrice !== undefined) {
    priceFilter['product_price'] = { ...priceFilter['product_price'], $gte: parseFloat(minPrice) };
  }
  if (maxPrice !== undefined) {
    priceFilter['product_price'] = { ...priceFilter['product_price'], $lte: parseFloat(maxPrice) };
  }
  return priceFilter;
};
module.exports = getPriceFilter;