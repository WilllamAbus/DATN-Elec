const Product = require('../../../../model/product_v2/index');
const ProductVariant = require('../../../../model/product_v2/productVariant');

const getAllProductsByVariantPriceService = {
  getAllProductsByVariantPrice: async (slug) => {
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

      // 3. Lấy giá trung bình từ các `variant_price` của sản phẩm hiện tại
      const targetPrices = product.variants.map((variant) => variant.variant_price);

      if (targetPrices.length === 0) {
        return {
          success: false,
          err: 3,
          msg: 'Sản phẩm không có variants',
          status: 404,
        };
      }

      // 4. Tính giá trung bình (hoặc lấy giá đầu tiên nếu chỉ có 1 variant)
      const avgTargetPrice = targetPrices.length > 1 
        ? targetPrices.reduce((sum, price) => sum + price, 0) / targetPrices.length 
        : targetPrices[0];

      // 5. Xác định khoảng giá +- 1 triệu
      const priceRange = 1000000; // +- 1 triệu
      const minPrice = avgTargetPrice - priceRange;
      const maxPrice = avgTargetPrice + priceRange;

      console.log(`Mức giá mục tiêu: ${avgTargetPrice}, Khoảng giá từ: ${minPrice} - ${maxPrice}`);

      // 6. Tìm các variants trong khoảng giá của tất cả sản phẩm
      const matchingVariants = await ProductVariant.find({
        variant_price: { $gte: minPrice, $lte: maxPrice },
      }).populate({
        path: 'product',
        select: 'product_name slug product_type', // Lấy product_type của sản phẩm
      })
      .populate({
        path: 'image',
        populate: {
          path: 'color', // Populate thêm trường color từ bảng liên kết
          select: 'name code', // Chọn các field mà bạn muốn lấy từ color
        },
        select: 'image color',
      })
      
      .lean();

      // 7. Lọc các variants có cùng product_type với sản phẩm ban đầu
      const matchingProducts = matchingVariants
      .filter((variant) => variant.product?.product_type?.equals(productType)) // Dùng equals để so sánh ObjectId
      .map((variant) => ({
        _id: variant._id,
        product_name: variant.product?.product_name || 'Không có tên',
        slug: variant.product?.slug || '',
        variant_name: variant.variant_name,
        variant_price: variant.variant_price,
        image:variant.image
      }));
    
        console.log(`Product Type: ${productType}`);

      // 8. Kiểm tra dữ liệu trả về
      if (matchingProducts.length === 0) {
        return {
          success: true,
          err: 0,
          msg: 'Không tìm thấy sản phẩm nào tương tự trong cùng phân khúc giá',
          status: 200,
          data: [],
        };
      }

      return {
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        data: matchingProducts,
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
