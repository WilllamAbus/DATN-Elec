const { checkProductNameExists,isValidProductName } = require('./name');
const { validateProductPrice,validateProductPriceInput } = require('./price');
const { validateWeight,validateWeightInput } = require('./weight');
module.exports = {
  checkProductNameExists,
  isValidProductName,
  validateProductPrice,
  validateProductPriceInput,
  validateWeight,
  validateWeightInput
};