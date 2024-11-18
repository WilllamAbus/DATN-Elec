const getProductDetail = require('./getProductDetail').getProductDetail;
const getAllStorageBySlugUrl = require('./getAllStorageBySlugUrl').getAllStorageBySlugUrl;
const getAllProductVariantsByVariantPrice = require('./getAllProductVariantByVariantPrice').getAllProductVariantsByVariantPrice;
module.exports = {
  getProductDetail,
  getAllStorageBySlugUrl,
  getAllProductVariantsByVariantPrice
}