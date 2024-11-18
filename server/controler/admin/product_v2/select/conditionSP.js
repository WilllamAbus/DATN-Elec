const modelConditionShopping = require('../../../../model/condition-shop.model');

const selectConditionShopping = async (req, res) => {
  try {
    const selectConditionShopping = await modelConditionShopping.find({ status: { $ne: 'disable' } }).select('_id nameCondition');

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Select condition shopping ok',
      status: 200,
      selectConditionShopping
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Select condition shopping lỗi',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  selectConditionShopping,
};
