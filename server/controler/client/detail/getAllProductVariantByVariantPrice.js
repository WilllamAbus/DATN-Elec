const getAllProductsByVariantPriceService = require('../../../services/product/admin/product-variant/getAllProductsByVariantPrice.Service');

const getAllProductVariantsByVariantPrice = async (req, res) => {
  const { slug } = req.params;
  const { page = 1, limit = 2 } = req.query; 
  try {
    const response = await getAllProductsByVariantPriceService.getAllProductsByVariantPrice(slug, parseInt(page), parseInt(limit));

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
      pagination: {
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalItems,
        hasNextPage: response.pagination.currentPage < response.pagination.totalPages,
        hasPrevPage: response.pagination.currentPage > 1,
      },
    });
  } catch (error) {
    console.error('Error in getAllProductsByPrice:', error);
    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Error: ' + error.message,
      status: 500,
    });
  }
};

module.exports = {
  getAllProductVariantsByVariantPrice,
};
