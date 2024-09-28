
const {homeAllProduct,getID,auction,upView,shopping,search} = require('./home');
const {getLimitProductClient} = require('./product');
const {listcatenav,getProductsByCategory} = require('./navbar');
const {listPageAuction,resetFilter} = require('./page-auction-product');
const {
  getAllBrandPageAuction,
  getALLConditionShopping,
  getAllProductVariants,
  getAllColorVariant,
} = require('./sidebar');
const {
  getAllRam,
  getAllColor,
  getAllCpu,
  getAllScreen,
  getAllGraphicsCard,
  getAllBattery,
  getAllOperatingSystem,
  getAllStorage
} = require('./attributes');
module.exports = {
  homeAllProduct,
  getID,
  listcatenav,
  getLimitProductClient,
  getProductsByCategory,
  shopping,
  auction,
  upView,
  listPageAuction,
  resetFilter,
  getAllBrandPageAuction,
  getALLConditionShopping,
  getAllProductVariants,
  getAllColorVariant,
  search,
  getAllRam,
  getAllColor,
  getAllCpu,
  getAllScreen,
  getAllGraphicsCard,
  getAllBattery,
  getAllOperatingSystem,
  getAllStorage
};
