const modelProduct = require('../../../model/product_v2');

const homeAllProduct = async (req, res) => {
  try {
    const products = await modelProduct.find({ status: { $ne: 'disable' } });
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      products
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

module.exports = {
  homeAllProduct,
};
