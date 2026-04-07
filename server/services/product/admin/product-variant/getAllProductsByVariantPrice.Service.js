const Product = require('../../../../model/product_v2/index');
const ProductVariant = require('../../../../model/product_v2/productVariant');

const getAllProductsByVariantPriceService = {
  getAllProductsByVariantPrice: async (slug, page = 1, limit = 5) => {
    try {
      // 1. Tìm sản phẩm dựa trên slug
      const product = await Product.findOne({ slug }).populate('variants').lean();
    
      if (!product) {
        return {
          success: false,
          err: 1,
          msg: 'Không tìm thấy sản phẩm',
          status: 404,
        };
      }
    
      // 2. Lấy product_type từ sản phẩm
      const productType = product.product_type;
    
      if (!productType) {
        return {
          success: false,
          err: 2,
          msg: 'Không tìm thấy loại sản phẩm (product_type)',
          status: 404,
        };
      }
    
      // 3. Lấy giá từ các `variant_price` của sản phẩm hiện tại
      const targetPrices = product.variants.map((variant) => variant.variant_price);
    
      if (targetPrices.length === 0) {
        return {
          success: false,
          err: 3,
          msg: 'Sản phẩm không có variants',
          status: 404,
        };
      }
    
      // 4. Xác định biến thể có giá gần nhất
      const closestPrice = targetPrices.reduce((prev, curr) => Math.abs(curr - targetPrices[0]) < Math.abs(prev - targetPrices[0]) ? curr : prev);
      const avgTargetPrice = closestPrice;
    
      // 5. Xác định khoảng giá
      const minPrice = avgTargetPrice - 3000000; // Giá thấp hơn 2 triệu
      const maxPrice = avgTargetPrice + 3000000; // Giá cao hơn 2 triệu
    
      // 6. Tìm các variants trong khoảng giá (không lấy chính sản phẩm hiện tại)
      const matchingVariantsQuery = ProductVariant.find({
        variant_price: { $gte: minPrice, $lte: maxPrice },
        product: { $ne: product._id }, // Không lấy sản phẩm hiện tại
      })
        .populate({
          path: 'product',
          select: 'product_name slug product_type',
        })
        .populate({
          path: 'image',
          populate: {
            path: 'color', // Populate thêm trường color từ bảng liên kết
            select: 'name code',
          },
          select: 'image color',
        })
        .lean();
    
      // 7. Áp dụng phân trang
      const totalItems = await ProductVariant.countDocuments({
        variant_price: { $gte: minPrice, $lte: maxPrice },
        product: product._id, // Chỉ đếm các variants của sản phẩm hiện tại
      });
    
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;
    
      const matchingVariants = await matchingVariantsQuery.skip(skip).limit(limit);
    
      // 8. Lọc các variants có cùng product_type
      const matchingProducts = matchingVariants.filter((variant) =>
        variant.product?.product_type?.equals(productType)
      ).map((variant) => ({
        _id: variant._id,
        product_name: variant.product?.product_name || 'Không có tên',
        slug: variant.product?.slug || '',
        variant_name: variant.variant_name,
        variant_price: variant.variant_price,
        image: variant.image,
      }));
    
      // 9. Kiểm tra dữ liệu trả về
      if (matchingProducts.length === 0) {
        return {
          success: true,
          err: 0,
          msg: 'Không tìm thấy sản phẩm nào tương tự trong cùng phân khúc giá',
          status: 200,
          data: [],
          pagination: { totalItems, totalPages, currentPage: page },
        };
      }
    
      return {
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        data: matchingProducts,
        pagination: { totalItems, totalPages, currentPage: page },
      };
    } catch (error) {
      console.error('Error in getAllProductsByVariantPrice:', error);
      return {
        success: false,
        err: -1,
        msg: 'Error: ' + error.message,
        status: 500,
      };
    }
  },
};


module.exports = getAllProductsByVariantPriceService;
