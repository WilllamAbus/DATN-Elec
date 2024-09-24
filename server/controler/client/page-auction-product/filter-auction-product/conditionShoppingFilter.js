const mongoose = require('mongoose');
const getConditionShoppingFilter = (conditionShopping) => {
  return conditionShopping && conditionShopping.length > 0
    ? { product_condition: { $in: conditionShopping.map(condition => mongoose.Types.ObjectId(condition)) } }
    : {};
};
module.exports = getConditionShoppingFilter;