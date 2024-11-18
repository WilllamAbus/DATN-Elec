const Product = require('../../../model/product_v2');
const ProductType = require('../../../model/catgories.model');
const mongoose = require('mongoose');
const ProductVariant = require('../../../model/product_v2/productVariant');
const ProductCategoryService = {
  getProductsByCategory: (categoryId, page = 1, limit = 12, _sort, brand, ram, storage, conditionShopping, minPrice, maxPrice, minDiscountPercent, maxDiscountPercent, variantPrices) => new Promise(async (resolve, reject) => {
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
          ram: { $in: ram.filter(ramId => mongoose.Types.ObjectId.isValid(ramId)) }
        }).distinct('_id') // Lấy danh sách unique _id
        : [];
        console.log('Danh sách ramVariantIds:', ramVariantIds);
      const storageVariantIds = storage && storage.length > 0
      ? await ProductVariant.find({
        storage: { $in: storage.filter(storageId => mongoose.Types.ObjectId.isValid(storageId)) }
      }).distinct('_id')
      : [];
      console.log('Danh sách storageVariantIds:', storageVariantIds);
      const ramFilter = ramVariantIds.length > 0
      ? { variants: { $in: ramVariantIds } }
      : {};

      const storageFilter = storageVariantIds.length > 0
    ? { variants: { $in: storageVariantIds } }
    : {};

      const conditionShoppingFilter = conditionShopping && conditionShopping.length > 0
        ? { product_condition: { $in: conditionShopping.map(condition => mongoose.Types.ObjectId(condition)) } }
        : {};

      const priceFilter = {};
      if (minPrice !== undefined || maxPrice !== undefined) {
        const variantPriceFilter = {};
        if (minPrice !== undefined) {
          variantPriceFilter['variant_price'] = { $gte: parseFloat(minPrice) };
        }
        if (maxPrice !== undefined) {
          variantPriceFilter['variant_price'] = { $lte: parseFloat(maxPrice) };
        }

        // Kiểm tra xem có variant nào có variant_price không
        const variantsWithPrice = await ProductVariant.find({
          ...variantPriceFilter
        }).select('_id');

        if (variantsWithPrice.length > 0) {
          priceFilter['variants'] = { $in: variantsWithPrice.map(variant => variant._id) };
        }
      }


      const discountFilter = {};
      if (minDiscountPercent !== undefined) {
        discountFilter['product_discount.discountPercent'] = { ...discountFilter['product_discount.discountPercent'], $gte: parseFloat(minDiscountPercent) };
      }
      if (maxDiscountPercent !== undefined) {
        discountFilter['product_discount.discountPercent'] = { ...discountFilter['product_discount.discountPercent'], $lte: parseFloat(maxDiscountPercent) };
      }

      const sortOptions = {};





      const products = await Product.find({
        product_type: categoryId,
        status: { $ne: 'disable' },
        variants: { $exists: true, $ne: [] },
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
        .populate('product_condition')
        .populate('product_supplier')
        .populate({
          path: 'variants',
          populate: {
            path: 'product_discount'
          }
        })
        .select('product_name image product_description slug product_discount product_brand variants product_condition product_supplier product_quantity product_ratingAvg product_view weight_g isActive status disabledAt comments')
        .lean();
      // Log giá trị các variant_price để kiểm tra
      console.log('Trước khi sắp xếp:', products.map(product => ({
        product_name: product.product_name,
        variant_price: product.variants.map(v => v.variant_price),
      })));

      // Sắp xếp trong JavaScript dựa trên variant_price
      if (_sort) {
        const [sortField, sortDirection] = _sort.split(":");
        if (sortField === "variant_price") {
          products.sort((a, b) => {
            const aPrice = a.variants[0]?.variant_price || 0;
            const bPrice = b.variants[0]?.variant_price || 0;
            return sortDirection === "ASC" ? aPrice - bPrice : bPrice - aPrice;
          });
        }
      }

      // Log lại kết quả sau khi sắp xếp
      console.log('Sau khi sắp xếp:', products.map(product => ({
        product_name: product.product_name,
        variant_price: product.variants.map(v => v.variant_price),
      })));

      const total = await Product.countDocuments({
        product_type: categoryId,
        status: { $ne: 'disable' },
        variants: { $exists: true, $ne: [] },
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
