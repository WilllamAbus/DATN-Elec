const Product = require('../../../model/product_v2');
const ProductType = require('../../../model/catgories.model');
const mongoose = require('mongoose');
const ProductVariant = require('../../../model/product_v2/productVariant');
const ProductCategoryService = {
  getProductsByCategory: (categoryId, page = 1, limit = 12, _sort, brand, ram, storage, conditionShopping, minPrice, maxPrice, minDiscountPercent, maxDiscountPercent) => new Promise(async (resolve, reject) => {
    try {
      page = parseInt(page, 10) || 1;
      limit = parseInt(limit, 10) || 12;
      const offset = (page - 1) * limit;

      if (limit <= 0) {
        return reject({
          success: false,
          err: 1,
          msg: 'Giá trị limit không hợp lệ.',
          status: 400
        });
      }

      if (page <= 0) {
        return reject({
          success: false,
          err: 1,
          msg: 'Giá trị page không hợp lệ.',
          status: 400
        });
      }
      

      const brandFilter = brand && brand.length > 0
        ? { product_brand: { $in: brand.map(brand => mongoose.Types.ObjectId(brand)) } }
        : {};


      const ramVariantIds = ram && ram.length > 0
        ? await ProductVariant.find({
          ram: {
            $in: ram.filter(ramId => mongoose.Types.ObjectId.isValid(ramId))
              .map(ramId => mongoose.Types.ObjectId(ramId))
          }
        }).select('_id')
        : [];

      const storageVariantIds = storage && storage.length > 0
        ? await ProductVariant.find({
          storage: {
            $in: storage.filter(storageId => mongoose.Types.ObjectId.isValid(storageId))
              .map(storageId => mongoose.Types.ObjectId(storageId))
          }
        }).select('_id')
        : [];


      const ramFilter = ramVariantIds.length > 0
        ? { 'variants': { $in: ramVariantIds.map(variant => variant._id) } }
        : {};

      const storageFilter = storageVariantIds.length > 0
        ? { 'variants': { $in: storageVariantIds.map(variant => variant._id) } }
        : {};

      const conditionShoppingFilter = conditionShopping && conditionShopping.length > 0
        ? { product_condition: { $in: conditionShopping.map(condition => mongoose.Types.ObjectId(condition)) } }
        : {};

      const priceFilter = {};
      if (minPrice !== undefined) {
        priceFilter['product_price'] = { ...priceFilter['product_price'], $gte: parseFloat(minPrice) };
      }
      if (maxPrice !== undefined) {
        priceFilter['product_price'] = { ...priceFilter['product_price'], $lte: parseFloat(maxPrice) };
      }

      const discountFilter = {};
      if (minDiscountPercent !== undefined) {
        discountFilter['product_discount.discountPercent'] = { ...discountFilter['product_discount.discountPercent'], $gte: parseFloat(minDiscountPercent) };
      }
      if (maxDiscountPercent !== undefined) {
        discountFilter['product_discount.discountPercent'] = { ...discountFilter['product_discount.discountPercent'], $lte: parseFloat(maxDiscountPercent) };
      }

      const sortOptions = {};
      if (_sort) {
        const [field, direction] = _sort.split(':');
        sortOptions[field] = direction === 'ASC' ? 1 : -1;
      }

      const products = await Product.find({
        product_type: categoryId,
        status: { $ne: 'disable' },
        ...brandFilter,
        ...conditionShoppingFilter,
        ...priceFilter,
        ...discountFilter,
        ...ramFilter,
        ...storageFilter,
      })
        .sort(sortOptions)
        .skip(offset)
        .limit(limit)
        .populate('product_type')
        .populate('product_brand')
        .populate('product_format')
        .populate('product_condition')
        .populate('product_supplier')
        .populate('variants')
        .select('product_name image product_description slug product_discount product_brand variants product_format product_condition product_supplier product_quantity product_ratingAvg product_view product_price product_price_unit product_attributes weight_g isActive status disabledAt comments')
        .lean();

      const total = await Product.countDocuments({
        product_type: categoryId,
        status: { $ne: 'disable' },
        ...brandFilter,
        ...conditionShoppingFilter,
        ...priceFilter,
        ...discountFilter,
        ...ramFilter,
        ...storageFilter,
      });
      const categoryInfo = await ProductType.findById(categoryId).select('name');
      if (!categoryInfo) {
        return reject({
          success: false,
          err: 1,
          msg: 'Không tìm thấy danh mục.',
          status: 404
        });
      }
      resolve({
        success: true,
        err: 0,
        msg: products.length ? 'OK' : 'Không thấy sản phẩm.',
        status: 200,
        response: {
          total,
          category: categoryInfo.name,
          products,
        },
      });

    } catch (error) {
      reject({ success: false, err: 1, msg: 'LỗI không có sản phẩm: ' + error.message, status: 500 });
    }
  }),
};

module.exports = ProductCategoryService;