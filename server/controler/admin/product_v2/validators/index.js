const { checkProductNameExists,isValidProductName } = require('./name');
const { validateProductPrice } = require('./price');

module.exports = {
  checkProductNameExists,
  isValidProductName,
  validateProductPrice,
};