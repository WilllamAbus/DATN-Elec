const { add } = require('./add');
const { addVariant } = require('./addVariant');
const { addImageVariant } = require('./addImageVariant');
const { list } = require('./list');
const { softDelete } = require('./softdelete');
const { getOne } = require('./getOne');
const { update } = require('./update');
const { hardDelete } = require('./hardDelete');
const { restore } = require('./restore');
const { getProductLimit } = require('./pagi');
const { deletedList } = require('./deletedList ');
const { getVariantsByProductId } = require('./getVariantsByProductId');
const { searchVariants } = require('./searchVariants');
const { getOneProductVariant } = require('./getOneProductVariant');
const {
   selectbrand,
   selectSupplier,
   selectDiscount,selectProductFormat,
   selectConditionShopping,
   getVariantColorsById,
   selectCategories } = require('./select');
module.exports = {
  list,
  add,
  addImageVariant,
  softDelete,
  getOne,
  update,
  hardDelete,
  restore,
  selectbrand,
  getVariantColorsById,
  selectSupplier,
  selectDiscount,
  selectProductFormat,
  selectConditionShopping,
  selectCategories,
  getProductLimit,
  deletedList,
  addVariant,
  getVariantsByProductId,
  searchVariants,
  getOneProductVariant

};
