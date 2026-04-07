const modelDiscount = require('../../../../model/discount.model');
const selectDiscount = async (req, res) => {
  try {
    const selectDiscounts = await modelDiscount.find({ status: { $ne: 'disable' } }).select('_id code discountPercent');
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Select discount ok',
      status: 200,
      selectDiscounts
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
