const modelBrand = require('../../../model/brands.model');

const getAllBrandPageAuction = async (req, res) => {
  try {
    const brands = await modelBrand.find({ status: { $ne: 'disable' } }).select('_id name');
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      brands
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Lỗi',
      status: 500,
      error: error.message,
    });
  }
};


module.exports = { getAllBrandPageAuction };
