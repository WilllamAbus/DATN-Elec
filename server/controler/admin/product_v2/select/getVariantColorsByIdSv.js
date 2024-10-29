const ProductVariant = require('../../../../model/product_v2/productVariant');

const ProductDetailService = {
  getVariantColorsByIdSV: async (product_variant_id) => {
    try {
      const product = await ProductVariant.findOne({ _id: product_variant_id })
        .populate({
          path: 'color',
          select: 'id code name', 
        })
        .lean();

      if (!product) {
        return {
          success: false,
          err: 1,
          msg: 'Không tìm thấy sản phẩm',
          status: 404,
        };
      }

      return {
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        data: product.color,
      };

    } catch (error) {
      return {
        success: false,
        err: -1,
        msg: 'Error: ' + error.message,
        status: 500,
      };
    }
  },
};

module.exports = ProductDetailService;
