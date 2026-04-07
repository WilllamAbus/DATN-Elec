const ProductCategoryService = require('./ProductCategorySV');
const Category = require('../../../model/catgories.model');

const getProductsByCategory = async (req, res) => {
  const { slug } = req.params;
  const { page, _sort, brand, ram, storage, conditionShopping, minPrice, maxPrice, minDiscountPercent, maxDiscountPercent } = req.query;
  const limit = 8;
  const brands = brand ? brand.split(',').map(b => b.trim()).filter(b => b) : [];
  const conditions = conditionShopping ? conditionShopping.split(',').map(c => c.trim()).filter(c => c) : [];
  const rams = ram ? ram.split(',').map(r => r.trim()).filter(r => r) : [];
  const storages = storage ? storage.split(',').map(s => s.trim()).filter(s => s) : [];

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); 
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        success: false,
        err: 'Lỗi',
        msg: 'Không tìm thấy danh mục',
        status: 404
      });
    }

    const response = await ProductCategoryService.getProductsByCategory(
      category._id,
      page,
      limit,
      _sort,
      brands,
      rams,
      storages,
      conditions,
      minPrice,
      maxPrice,
      minDiscountPercent,
      maxDiscountPercent
    );

    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi',
        status: 400
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
      }
    });

  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Error: ' + error.message,
      status: 500
    });
  }
};

module.exports = {
  getProductsByCategory
};