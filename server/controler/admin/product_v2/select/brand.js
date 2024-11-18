const modelBrand = require('../../../../model/brands.model');

const selectbrand = async (req, res) => {
  try {
    const selectbrand = await modelBrand.find({ status: { $ne: 'disable' } }).select('_id name');
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Select brand ok',
      status: 200,
      selectbrand
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Select brand lỗi',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  selectbrand,
};
