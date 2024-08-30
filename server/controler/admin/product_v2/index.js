const { add } = require('./add');
const { list } = require('./list');
const { softDelete } = require('./softdelete');
const { getOne } = require('./getOne');
const { update } = require('./update');
const { hardDelete } = require('./hardDelete ');
const { restore } = require('./restore');
const { getProductLimit } = require('./pagi');
const {
   selectbrand,
   selectSupplier,
   selectDiscount,selectProductFormat,
   selectConditionShopping,
   selectCategories } = require('./select');
module.exports = {
  list,
  add,
  softDelete,
  getOne,
  update,
  hardDelete,
  restore,
  selectbrand,
  selectSupplier,
  hardDelete,
  selectDiscount,
  selectProductFormat,
  selectConditionShopping,
  selectCategories,
  getProductLimit
};
