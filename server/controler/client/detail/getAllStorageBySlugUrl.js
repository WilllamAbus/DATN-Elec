  const ProductDetailService = require('./productDetailSV');
  const Product = require('../../../model/product_v2');
  const getAllStorageBySlugUrl = async (req, res) => {
    const { slug } = req.params;  

    try {

      const product = await Product.findOne({ slug });
      if (!product) {
        return res.status(404).json({
          success: false,
          err: 'Lỗi',
          msg: 'Không tìm thấy sản phẩm',
          status: 404
        });
      }


      const response = await ProductDetailService.getAllVariantStorage(slug);

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
      console.error('Error in getAllStorageBySlugUrl:', error);
      return res.status(500).json({
        success: false,
        err: -1,
        msg: 'Error: ' + error.message,
        status: 500,
      });
    }
  };

  module.exports = {
    getAllStorageBySlugUrl,
  };
