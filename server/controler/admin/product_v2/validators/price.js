const validateProductPrice = (price) => {
  return typeof price === 'number' && price >= 1000 && price <= 200000000;
};

module.exports = {
  validateProductPrice,
};