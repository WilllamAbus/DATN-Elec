const mongoose = require('mongoose');
const Product = require('../../../model/product_v2');
const productVariant = require('../../../model/product_v2/productVariant');
const Imagevariant = require('../../../model/product_v2/imagevariant');
const Color = require('../../../model/attributes/color');
const ProductDetailService = {
  getProductDetail: async (slug, storage,color) => { 
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
            {
              path: 'image',
              select: 'image color slug', 
            },
            'battery',
            {
              path: 'color',
              select: 'name slug code', 
            },
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
          'product_name product_description slug product_discount product_brand variants product_format product_condition product_supplier product_quantity product_ratingAvg product_view product_price product_price_unit product_attributes weight_g isActive status disabledAt comments inventory'
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

         // Kiểm tra nếu không có tham số storage hoặc color
         if (!storage && !color) {
          // Nếu không có tham số nào, trả về biến thể đầu tiên
          if (product.variants && product.variants.length > 0) {
            product.variants = [product.variants[0]]; // Lấy biến thể đầu tiên
          }
        } else {
          // Lọc theo storage nếu có
          if (storage) {
            product.variants = product.variants.filter((variant) => {
              if (Array.isArray(variant.storage)) {
                return variant.storage.some((storageItem) =>
                  storageItem.slug.toLowerCase().includes(storage.toLowerCase())
                );
              } else if (variant.storage && variant.storage.slug) {
                return variant.storage.slug.toLowerCase().includes(storage.toLowerCase());
              }
              return false;
            });
          }
          // Lọc theo color nếu có
          if (color) {
            product.variants = product.variants
              .filter((variant) => {
                const filteredImages = variant.image.filter((img) => img.slug === color);
                return filteredImages.length > 0; 
              })
              .map((variant) => {
                variant.image = variant.image.filter((img) => img.slug === color);
                return variant;
              });
          }
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
