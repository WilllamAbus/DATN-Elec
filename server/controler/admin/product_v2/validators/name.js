const ProductV2 = require('../../../../model/product_v2');

const checkProductNameExists = async (productName) => {
  return await ProductV2.findOne({ product_name: productName });
};
const isValidProductName = (productName) => {
  return productName && typeof productName === 'string' && productName.trim() !== '';
};

module.exports = {
  checkProductNameExists,
  isValidProductName
};