const Product = require('../../../../model/product_v2/');

const selectProduct = async (req, res) => {
  try {
    const products = await Product.find({ status: { $ne: 'disable' } })
      .select('_id product_name')
      
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Chọn sản phẩm thành công',
      status: 200,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi chọn sản phẩm',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  selectProduct,
};
