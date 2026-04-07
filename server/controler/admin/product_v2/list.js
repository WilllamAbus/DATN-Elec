const modelProduct = require('../../../model/product_v2');
const list = async (req, res) => {
  try {
    const products = await modelProduct.find({ status: { $ne: 'disable' } })
    .populate('product_type', 'name');
      
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Lấy danh sách sản phẩm thành công ok',
      status: 200,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Lấy danh sách sản phẩm thất bại',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  list,
};
