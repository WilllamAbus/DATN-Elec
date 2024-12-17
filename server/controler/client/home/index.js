const homeAllProduct = require('./allProduct').homeAllProduct;
const getID = require('./allProduct').getID;
const shopping = require('./allProduct').shopping ;
const auction = require('./allProduct').auction ;
const upView = require('./allProduct').upView;
const  search = require('./allProduct').search;
const  getPhoneByVariants = require('./phone').getPhoneByVariants;
module.exports = {
  homeAllProduct,
  getID,
  shopping,
  auction,
  upView,
  search,
  getPhoneByVariants
};
