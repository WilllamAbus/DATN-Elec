const ProductDetailService = require('./getVariantColorsByIdSv');
const ProductVariant = require('../../../../model/product_v2/productVariant');

const getVariantColorsById = async (req, res) => {
  const { product_variant_id } = req.params;
  
  try {
    console.log('ID received:', product_variant_id); 
    const product = await ProductVariant.findOne({ _id: product_variant_id }); 
    console.log('Product found:', product); 
    
    if (!product) {
      return res.status(404).json({
        success: false,
        err: 'Lỗi',
        msg: 'Không tìm thấy sản phẩm',
        status: 404,
      });
    }

    const response = await ProductDetailService.getVariantColorsByIdSV(product_variant_id);

    if (!response.success) {
      return res.status(response.status).json({
        success: response.success,
        err: response.err,
        msg: response.msg,
        status: response.status,
      });
    }

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      data: response.data,
    });

  } catch (error) {
    console.error('Error in getVariantColorsById:', error);
    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Error: ' + error.message,
      status: 500,
    });
  }
};

module.exports = {
  getVariantColorsById,
};
