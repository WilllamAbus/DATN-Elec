const Product = require('../../../model/product_v2');
const ProductType = require('../../../model/catgories.model');
const ProductVariant = require('../../../model/product_v2/productVariant');

const getAccessoryVariantsService = {
  getAccessoryVariants: async (page = 1, limit = 10) => {
    try {
      page = parseInt(page, 10) || 1;
      limit = parseInt(limit, 10) || 10;
      const offset = (page - 1) * limit;

      if (limit <= 0) {
        return {
          success: false,
          err: 1,
          msg: 'Giá trị limit không hợp lệ.',
          status: 400
        };
      }

      if (page <= 0) {
        return {
          success: false,
          err: 1,
          msg: 'Giá trị page không hợp lệ.',
          status: 400
        };
      }

      const category = await ProductType.findOne({ slug: 'linh-kien' }).lean();
      if (!category) {
        return {
          success: false,
          err: 1,
          msg: 'Không tìm thấy danh mục điện thoại.',
          status: 404,
        };
      }

      const products = await Product.find({
        product_type: category._id,
        status: { $ne: 'disable' },
      })
        .populate('product_type')
        .populate('product_brand')
        .lean();

      if (products.length === 0) {
        return {
          success: false,
          err: 1,
          msg: 'Không thấy sản phẩm.',
          status: 404,
        };
      }

      // Lấy danh sách các biến thể với phân trang
      const variantsPromises = products.map(product =>
        ProductVariant.find({ product: product._id })
          .populate('storage', 'name')
          .populate('ram', 'name')
          .populate('color', 'name')
          .populate('image', 'image color')
          .populate('operatingSystem', 'name')
          .populate('screen', 'name')
          .populate('product_discount', 'code discountPercent')
          .populate('product', 'slug')
          .lean()
      );

      const variants = await Promise.all(variantsPromises);
      const flatVariants = variants.flat();

      // Tính toán phân trang cho biến thể
      const totalVariants = flatVariants.length;
      const paginatedVariants = flatVariants.slice(offset, offset + limit);

      return {
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        response: {
          total: totalVariants,
          category: category.name,
          variants: paginatedVariants,
        },
      };
    } catch (error) {
      console.error('loi:', error.message);
      return {
        success: false,
        err: 1,
        msg: 'Lỗi khi lấy sản phẩm biến thể: ' + error.message,
        status: 500,
      };
    }
  },
};

module.exports = getAccessoryVariantsService;
