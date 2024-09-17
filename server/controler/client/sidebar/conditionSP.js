const _ConditionShopping = require('../../../model/condition-shop.model');
const getALLConditionShopping = async (req, res) => {
  try {
    const conditionShopping = await _ConditionShopping.find({ status: { $ne: 'disable' } });

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'condition shopping ok',
      status: 200,
      conditionShopping
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'condition shopping lỗi',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  getALLConditionShopping,
};
