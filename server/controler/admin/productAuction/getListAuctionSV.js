const ProductAuction = require('../../../model/productAuction/productAuction');
const ProductService = {
  getListProductAuctionService: (page, search) => new Promise(async (resolve, reject) => {
    try {
      const limit = parseInt(process.env.LIMIT, 10) || 3;
      const offset = (!page || +page <= 1) ? 0 : (+page - 1) * limit;
      const searchQuery = search
        ? {
          status: { $ne: 'disable' },
          product_name: { $regex: search, $options: 'i' }
        }
        : {
          status: { $ne: 'disable' },
        };


      const products = await ProductAuction.find(searchQuery)
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('product_type', 'name imgURL')
        .populate('product_brand', 'name')
        .populate('product_condition', 'name')
        .populate('product_supplier', 'name')
        .populate('auctionPricing')
        .select('product_name product_price image product_description hasVariants  product_brand product_format product_condition product_supplier  product_ratingAvg product_view  weight_g isActive status disabledAt auctionPricing')
        .lean();

      const total = await ProductAuction.countDocuments(searchQuery);

      resolve({
        success: true,
        err: 0,
        msg: products.length ? 'OK' : 'No products found.',
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
        msg: 'chưa có sản phẩm: ' + error.message,
        status: 500
      });
    }
  }),
};

module.exports = ProductService;
