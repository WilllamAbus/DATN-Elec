const Product = require('../../../model/product_v2');
const mongoose = require('mongoose');

const ProductAuctionService = {
  getAuctionProducts: (page = 1, limit = 6, _sort = "product_price:ASC") => new Promise(async (resolve, reject) => {
    try {
      const offset = (page - 1) * limit;

      const [sortField, sortDirection] = _sort.split(":");
      const sortOptions = {
        [sortField]: sortDirection === "ASC" ? 1 : -1 
      };

      const format = await mongoose.model('formatShopping').findOne({ formats: "Đấu giá" }).exec();
      if (!format) {
        return resolve({
          success: false,
          err: 1,
          msg: 'Không thấy sản phẩm đấu giá.',
          status: 404
        });
      }
      const products = await Product.find({ product_format: format._id, status: { $ne: 'disable' } })
      .sort(sortOptions) 
      .skip(offset)
      .limit(limit)
      .populate('product_type', 'name')
      .populate('product_brand', 'name')
      .populate('product_format', 'name')
      .populate('product_condition', 'name')
      .populate('product_supplier', 'name')
      .select('product_name image product_description product_slug product_discount product_brand product_format product_condition product_supplier product_quantity product_ratingAvg product_view product_price product_price_unit product_attributes weight_g isActive status disabledAt comments')
      .lean();
      const total = await Product.countDocuments({ product_format: format._id, status: { $ne: 'disable' } });

      resolve({
        success: true,
        err: 0,
        msg: products.length ? 'OK' : 'Không thấy sản phẩm.',
        status: 200,
        response: {
          total,
          products
        }
      });

    } catch (error) {
      reject({
        success: false,
        err: 1,
        msg: 'Lỗi không có sản phẩm: ' + error.message,
        status: 500
      });
    }
  }),
};

module.exports = ProductAuctionService;
