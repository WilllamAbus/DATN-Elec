
const {homeAllProduct,getID,auction,upView,shopping,search} = require('./home');
const {getLimitProductClient} = require('./product');
const {listcatenav,getProductsByCategory} = require('./navbar');
const {listPageAuction,resetFilter} = require('./page-auction-product');
const {getAllBrandPageAuction,getALLConditionShopping} = require('./sidebar');
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
  search
};
