const validateProductPrice = (price) => {
  return typeof price === 'number' && !isNaN(price) && price > 0;
};

const validateProductPriceInput = (priceInput) => {
  if (typeof priceInput === 'string') {
    if (isNaN(priceInput) || priceInput.trim() === '') {
      return false;
    }
    const priceAsNumber = parseFloat(priceInput);
    return validateProductPrice(priceAsNumber);
  }
  return validateProductPrice(priceInput);
};

module.exports = {
  validateProductPrice,
  validateProductPriceInput,
};
