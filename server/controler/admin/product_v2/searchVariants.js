const SearchVariantService = require('../../../services/product/admin/product-variant/search.service'); 
const Product = require('../../../model/product_v2'); 
const searchVariants = async (req, res) => {
  const { id } = req.params;
  const { searchTerm, page } = req.query; 
  const limit = 2; 
  try {
    let productId = null;
    if (id) {
      const product = await Product.findOne({ _id: id }); 
      if (!product) {
        return res.status(404).json({
          success: false,
          err: 'Lỗi',
          msg: 'Không tìm thấy sản phẩm',
          status: 404,
        });
      }
      productId = id; 
    }
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Thiếu search term.',
        status: 400,
      });
    }
    const response = await SearchVariantService.searchVariantsSV(searchTerm, page, limit, productId);

    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi',
        status: 400,
      });
    }
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(response.response.total / limit);
    return res.status(200).json({
      success: true,
      err: 0,
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
    console.error('Error in searchVariants:', error);
    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Error: ' + error.message,
      status: 500,
    });
  }
};
module.exports = {
  searchVariants,
};
