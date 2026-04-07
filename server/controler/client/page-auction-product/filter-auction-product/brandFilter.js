
const mongoose = require('mongoose');
const getBrandFilter = (brand) => {
  return brand && brand.length > 0
    ? { product_brand: { $in: brand.map(brand => mongoose.Types.ObjectId(brand)) } }
    : {};
};
module.exports = getBrandFilter;