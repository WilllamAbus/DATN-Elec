const Product = require('../../../model/product_v2');
const mongoose = require('mongoose');

const ProductCategoryService = {
  getProductsByCategory: (categoryId, page = 1, limit = 12, _sort, brand, conditionShopping, minPrice, maxPrice, minDiscountPercent, maxDiscountPercent) => new Promise(async (resolve, reject) => {
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

      const brandFilter =  brand && brand.length > 0
      ? { product_brand: { $in: brand.map(brand => mongoose.Types.ObjectId(brand)) } }
      : {};
  

      const conditionShoppingFilter =  conditionShopping && conditionShopping.length > 0
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
        ...discountFilter
      })
      .sort(sortOptions)
      .skip(offset)
      .limit(limit)
      .populate('product_type')
      .populate('product_brand')
      .populate('product_format')
      .populate('product_condition')
      .populate('product_supplier')
      .select('product_name image product_description product_slug product_discount product_brand product_format product_condition product_supplier product_quantity product_ratingAvg product_view product_price product_price_unit product_attributes weight_g isActive status disabledAt comments')
      .lean();

      const total = await Product.countDocuments({
        product_type: categoryId,
        status: { $ne: 'disable' },
        ...brandFilter,
        ...conditionShoppingFilter,
        ...priceFilter,
        ...discountFilter
      });

      resolve({
        success: true,
        err: 0,
        msg: products.length ? 'OK' : 'Không thấy sản phẩm.',
        status: 200,
        response: { total, products }
      });

    } catch (error) {
      reject({ success: false, err: 1, msg: 'LỗI không có sản phẩm: ' + error.message, status: 500 });
    }
  }),
};

module.exports = ProductCategoryService;