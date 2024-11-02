const Product = require('../../../model/productAuction/productAuction');
const { getBrandFilter, getConditionShoppingFilter, getDiscountFilter, getPriceFilter } = require('./filter-auction-product');


const ProductAuctionService = {
  getAuctionProducts: (page = 1, limit = 2, _sort = "product_price:ASC", brand, conditionShopping, minPrice, maxPrice, minDiscountPercent, maxDiscountPercent) => new Promise(async (resolve, reject) => {
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
      const [sortField, sortDirection] = _sort.split(":");
      const sortOptions = { [sortField]: sortDirection === "ASC" ? 1 : -1 };




      const brandFilter = getBrandFilter(brand);
      const conditionShoppingFilter = getConditionShoppingFilter(conditionShopping);
      const priceFilter = getPriceFilter(minPrice, maxPrice);
      const discountFilter = getDiscountFilter(minDiscountPercent, maxDiscountPercent);

      const products = await Product.find({
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
        .populate('product_condition')
        .populate('product_supplier')
        .select('product_name image product_description slug product_discount product_brand product_condition product_supplier  product_quantity product_ratingAvg product_view product_price product_price_unit weight_g isActive status disabledAt comments')
        .lean();
      console.log("Products:", products);
      const total = await Product.countDocuments({
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
      reject({
        success: false,
        err: -1,
        msg: 'LỗI không có sản phẩm: ' + error.message,
        status: 500
      });
    }
  }),
};



module.exports = ProductAuctionService;
