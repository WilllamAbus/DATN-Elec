const { add } = require('./add');
const { list } = require('./list');
const { softDelete } = require('./softdelete');

const {
   selectbrand,
   selectSupplier,
   selectDiscount,selectProductFormat,
   selectConditionShopping
   ,selectCategories } = require('./select');
module.exports = {
  list,
  add,
  softDelete,
  selectbrand,
  selectSupplier,
  selectDiscount,
  selectProductFormat,
  selectConditionShopping,
  selectCategories,
};
