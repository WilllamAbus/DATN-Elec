const selectbrand = require('./brand').selectbrand;
const selectSupplier = require('./supplier').selectSupplier;
const selectDiscount = require('./discount').selectDiscount;
const selectProductFormat = require('./formatSP').selectProductFormat;
const selectConditionShopping = require('./conditionSP').selectConditionShopping;
const selectCategories = require('./categorie').selectCategories;
const getVariantColorsById = require('./getVariantColorsById').getVariantColorsById;
module.exports = {
  selectbrand,
  selectSupplier,
  selectDiscount,
  selectProductFormat,
  selectConditionShopping,
  selectCategories,
  getVariantColorsById
};
