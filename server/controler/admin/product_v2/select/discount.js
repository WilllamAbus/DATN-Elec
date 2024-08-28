const modelDiscount = require('../../../../model/discount.model');
const selectDiscount = async (req, res) => {
  try {
    const discounts = await modelDiscount.find({ status: { $ne: 'disable' } });
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Select discount ok',
      status: 200,
      discounts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Select discount lỗi',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  selectDiscount,
};
