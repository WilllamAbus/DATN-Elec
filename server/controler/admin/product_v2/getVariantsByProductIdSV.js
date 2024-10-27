const Product = require('../../../model/product_v2');
const ProductVariantService = {
  getVariantsByProductIdSV: (productId, page = 1, limit = 2) => new Promise(async (resolve, reject) => {
    try {
      page = Math.max(parseInt(page, 10), 1);
      limit = Math.max(parseInt(limit, 10), 1);
      const offset = (page - 1) * limit;
  
      if (limit <= 0) {
        return reject({
          success: false,
          err: 1,
          msg: 'Giá trị limit không hợp lệ.',
          status: 400,
        });
      }
  
      if (page <= 0) {
        return reject({
          success: false,
          err: 1,
          msg: 'Giá trị page không hợp lệ.',
          status: 400,
        });
      }
  
      // Lấy sản phẩm với biến thể (theo page và limit)
      const product = await Product.findOne({ _id: productId })
        .populate({
          path: 'variants',
          options: {
            skip: offset,  // Bỏ qua các biến thể theo offset
            limit: limit,  // Giới hạn số biến thể trả về
          },
          populate: [
            { path: 'battery' },
            { path: 'color' },
            { path: 'cpu' },
            { path: 'operatingSystem' },
            { path: 'ram' },
            { path: 'screen' },
            { path: 'storage' },
            {
              path: 'image',
              select: 'image color'
            },
            {
              path: 'inventory',
              select: 'quantityShelf quantityStock totalQuantity price totalPrice status createdAt updatedAt',
            },
          ]
        })
        .lean();
  
      if (!product) {
        return resolve({
          success: false,
          err: 1,
          msg: 'Không thấy sản phẩm.',
          status: 404,
        });
      }
  
      const totalVariantsCount = await Product.aggregate([
        { $match: { _id: productId } },
        { $project: { totalVariants: { $size: "$variants" } } }
      ]);
  
      // Lấy tổng số biến thể nếu có kết quả
      const totalVariants = totalVariantsCount.length > 0 ? totalVariantsCount[0].totalVariants : 0;
  
      const variants = product.variants || [];
      const productCountOnPage = variants.length;
      resolve({
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        response: {
          total: totalVariants,
          productCountOnPage,
          variants: product.variants || [],
          currentPage: page,
          limit,
        },
      });
    } catch (error) {
      reject({ success: false, err: 1, msg: 'Lỗi không có sản phẩm: ' + error.message, status: 500 });
    }
  }),
  

};

module.exports = ProductVariantService;
