const modelVariant = require('../../../model/product_v2/productVariant');

const getAllProductVariants = async (req, res) => {
  try {
    const variants = await modelVariant.find({ status: { $ne: 'disable' } }).select('_id variant_name variant_price variant_attributes image');
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      variants
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Lỗi',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = { getAllProductVariants };
