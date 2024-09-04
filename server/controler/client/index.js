
const {homeAllProduct,getID,auction,upView,shopping } = require('./home');
const {getLimitProductClient} = require('./product');
const {listcatenav,getProductsByCategory} = require('./navbar');
module.exports = {
  homeAllProduct,
  getID,
  listcatenav,
  getLimitProductClient,
  getProductsByCategory,
  shopping,
  auction,
  upView

};
