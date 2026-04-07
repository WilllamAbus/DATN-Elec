const ImageByVariantIdService = require('../../../services/product/admin/product-variant/getImageByVariantId.service');
const ProductVariant = require('../../../model/product_v2/productVariant');

const getImageByVariantId = async (req, res) => {
  const { id } = req.params; 
  const { page = 1 } = req.query;
  const limit = 2;

  try {

    const productVariant = await ProductVariant.findById(id);
    if (!productVariant) {
      return res.status(404).json({
        success: false,
        msg: 'Không tìm thấy sản phẩm',
        status: 404,
      });
    }

    const response = await ImageByVariantIdService.getImageByVariantId(productVariant._id, page, limit);
    

    if (response.err) {
      return res.status(response.status || 400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi',
        status: response.status || 400,
      });
    }


    const currentPage = parseInt(page, 10);
    const totalPages = Math.ceil(response.response.total / limit);

    return res.status(200).json({
      success: true,
      msg: 'OK',
      status: 200,
      data: response.response,
      pagination: {
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error('Error in getImageByVariantId:', error);
    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Lỗi server: ' + error.message,
      status: 500,
    });
  }
};

module.exports = {
  getImageByVariantId,
};
