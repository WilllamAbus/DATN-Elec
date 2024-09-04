
const {homeAllProduct,getID } = require('./home');
const {getLimitProductClient} = require('./product');
const {listcatenav,getProductsByCategory} = require('./navbar');
module.exports = {
  homeAllProduct,
  getID,
  listcatenav,
  getLimitProductClient,
  getProductsByCategory
};
