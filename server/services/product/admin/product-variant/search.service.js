
const ProductVariant = require('../../../../model/product_v2/productVariant');
const SearchVariantService = {
  searchVariantsSV: (searchTerm, page = 1, limit = 2, productId = null) => new Promise(async (resolve, reject) => {
    try {
      page = parseInt(page, 10) || 1;
      limit = parseInt(limit, 10) || 12;
      const offset = (page - 1) * limit;
  
      if (!searchTerm) {
        return reject({
          success: false,
          err: 1,
          msg: 'Thiếu search term.',
          status: 400,
        });
      }
  
      const searchConditions = {
        variant_name: { $regex: new RegExp(searchTerm, 'i') },
        ...(productId && { product: productId })
      };
  
      const variants = await ProductVariant.find(searchConditions)
        .skip(offset)
        .limit(limit)
        .lean();
  
      const totalVariants = await ProductVariant.countDocuments(searchConditions);
  
      if (!variants.length) {
        return resolve({
          success: false,
          err: 1,
          msg: 'Không có variant nào khớp với tìm kiếm của bạn.',
          status: 404,
        });
      }
  
      resolve({
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        response: {
          total: totalVariants,
          variants: variants,
          currentPage: page,
          limit: limit,
        },
      });
    } catch (error) {
      reject({ success: false, err: 1, msg: 'Lỗi: ' + error.message, status: 500 });
    }
  }),

};

module.exports = SearchVariantService;
