const Product = require('../model/product.model'); // Đảm bảo đường dẫn đúng

const ProductService = {
  getProductLimitService: (page) => new Promise(async (resolve, reject) => {
    try {
      const limit = parseInt(process.env.LIMIT, 10) || 5;
      const offset = (!page || +page <= 1) ? 0 : (+page - 1) * limit;

      const products = await Product.find()
        .skip(offset)
        .limit(limit)
        .populate('categoryid', 'name')
        .select('name status price image quantity brand color description discount rating view')
        .lean();

      const total = await Product.countDocuments();

      resolve({
        err: products.length ? 0 : 1,
        msg: products.length ? 'OK' : 'Getting products failed.',
        response: {
          total,
          products
        }
      });

    } catch (error) {
      reject({
        err: 1,
        msg: 'Failed to fetch products: ' + error.message
      });
    }
  }),
};

module.exports = ProductService;
