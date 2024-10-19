const Product = require('../../../model/product_v2');

const ProductDetailService = {
  getProductDetail: async (slug, storage) => { 
    try {
      const query = { slug: slug, status: { $ne: 'disable' } };
      const product = await Product.findOne(query)
        .populate('product_type')
        .populate('product_brand')
        .populate('product_format')
        .populate('product_condition')
        .populate('product_supplier')
        .populate({
          path: 'variants',
          populate: [
            'battery',
            'color',
            'cpu',
            'operatingSystem',
            'ram',
            'screen',
            {
              path: 'storage',
              select: 'slug name sku pid status',
            },
            {
              path: 'inventory',
              select:
                'quantityShelf quantityStock totalQuantity price totalPrice status createdAt updatedAt',
            },
          ],
        })
        .select(
          'product_name image product_description slug product_discount product_brand variants product_format product_condition product_supplier product_quantity product_ratingAvg product_view product_price product_price_unit product_attributes weight_g isActive status disabledAt comments inventory'
        )
        .lean();

      if (!product) {
        return {
          success: false,
          err: 1,
          msg: 'Không tìm thấy sản phẩm',
          status: 404,
        };
      }

      if (storage) {
        // Lọc các biến thể có `storage` khớp với giá trị `storage`
        const variantsWithStorage = product.variants.map((variant) => {
          let isMatch = false;
        
          if (Array.isArray(variant.storage)) {
            isMatch = variant.storage.some((storageItem) =>
              storageItem.slug.toLowerCase().includes(storage.toLowerCase())
            );
          } else if (variant.storage && variant.storage.slug) {
            isMatch = variant.storage.slug.toLowerCase().includes(storage.toLowerCase());
          }
        
          // Thêm cờ `isMatch` vào mỗi biến thể để có thể hiển thị thêm các storage phù hợp
          return {
            ...variant,
            isMatch: isMatch,
          };
        });
      
        // Lọc chỉ hiển thị các `variant` có `isMatch = true`, nhưng vẫn giữ lại tất cả `storage` của các variant
        product.variants = variantsWithStorage;
      } else {
        // Nếu không có `storage`, hiển thị tất cả các `variant` như cũ
        product.variants = product.variants;
      }
      
      

      return {
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        err: -1,
        msg: 'Error: ' + error.message,
        status: 500,
      };
    }
  },
  getAllVariantStorage: async (slug) => {
    try {
      const product = await Product.findOne({ slug }).populate({
        path: 'variants',
        populate: {
          path: 'storage',
          select: 'slug name',  // Chọn các trường cần thiết trong storage
        }
      }).lean();

      if (!product) {
        return {
          success: false,
          err: 1,
          msg: 'Không tìm thấy sản phẩm',
          status: 404,
        };
      }

      // Lấy tất cả storage của các variant
      const storageList = product.variants.flatMap(variant => variant.storage);

      // Loại bỏ storage trùng lặp nếu có
      const uniqueStorage = Array.from(new Set(storageList.map(s => s.slug)))
        .map(slug => storageList.find(s => s.slug === slug));

      return {
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        data: uniqueStorage,
      };

    } catch (error) {
      return {
        success: false,
        err: -1,
        msg: 'Error: ' + error.message,
        status: 500,
      };
    }
  }
};

module.exports = ProductDetailService;
