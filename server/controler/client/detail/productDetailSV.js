const mongoose = require('mongoose');
const Product = require('../../../model/product_v2');
const productVariant = require('../../../model/product_v2/productVariant');
const Imagevariant = require('../../../model/product_v2/imagevariant');
const Color = require('../../../model/attributes/color');
const ViewHistory = require('../../../model/product_v2/viewHistory'); 
const ProductDetailService = {
  getProductDetail: async (slug, storage,color,userId) => { 
    try {
      const query = { slug: slug, status: { $ne: 'disable' } };
      const product = await Product.findOne(query)
        .populate('product_type')
        .populate('product_brand')
        .populate('product_condition')
        .populate('product_supplier')
        .populate('posts')
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
            'graphicsCard',
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
          'product_name product_description slug product_discount product_brand variants  product_condition product_supplier product_quantity product_ratingAvg product_view product_price product_price_unit product_attributes weight_g isActive status disabledAt comments inventory'
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
        let matchedVariant;
        if (storage || color) {
          matchedVariant = product.variants.find((variant) => {
            const isStorageMatch = Array.isArray(variant.storage)
              ? variant.storage.some((s) => s.slug === storage)
              : variant.storage && variant.storage.slug === storage;
            const isColorMatch = color ? variant.image.some((img) => img.slug === color) : true;
            return isStorageMatch && isColorMatch;
          });
        } else {
          matchedVariant = product.variants[0];
        }
        
        
        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000); 
        
        if (userId) {
          const viewHistoryEntry = await ViewHistory.findOne({
            user: userId,
            productVariant: matchedVariant._id,
          });
        
          if (!viewHistoryEntry || viewHistoryEntry.lastViewed < tenMinutesAgo) {
            if (viewHistoryEntry) {
              viewHistoryEntry.viewCount += 1;
              viewHistoryEntry.lastViewed = now;
              await viewHistoryEntry.save();
            } else {
              await ViewHistory.create({
                user: userId,
                productVariant: matchedVariant._id,
                viewCount: 1,
                lastViewed: now,
              });
            }
            await productVariant.findByIdAndUpdate(matchedVariant._id, {
              $inc: { viewCount: 1 },
            });
          }
        } else {
          const productVariantEntry = await productVariant.findById(matchedVariant._id);
          if (!productVariantEntry.lastViewed || productVariantEntry.lastViewed < tenMinutesAgo) {
            await productVariant.findByIdAndUpdate(matchedVariant._id, {
              $inc: { viewCount: 1 },
              lastViewed: now,
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
          select: 'slug name', 
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

      const storageList = product.variants.flatMap(variant => variant.storage);
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
