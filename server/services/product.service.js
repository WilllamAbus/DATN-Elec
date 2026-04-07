const Product = require('../model/product_v2');

const ProductService = {
  getProductLimitService: (page, search) => new Promise(async (resolve, reject) => {
    try {
      const limit = parseInt(process.env.LIMIT, 10) || 3;
      const offset = (!page || +page <= 1) ? 0 : (+page - 1) * limit;
      const searchQuery = search
        ? {
            status: { $ne: 'disable' },
            product_name: { $regex: search, $options: 'i' }
          }
        : { status: { $ne: 'disable' },
       };
        

      const products = await Product.find(searchQuery)
        .skip(offset)
        .limit(limit)
        .populate('product_type', 'name imgURL')  
        .populate('product_brand', 'name')
        .populate('product_condition', 'name')
        .populate('product_supplier', 'name')
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
        .select('product_name image product_description hasVariants  product_brand product_format product_condition product_supplier  product_ratingAvg product_view  weight_g isActive status disabledAt comments')
        .lean();
        const productsWithVariantCount = products.map((product) => ({
          ...product,
          variantCount: product.variants ? product.variants.length : 0, // Thêm trường variantCount
        }));
      const total = await Product.countDocuments(searchQuery); 

      resolve({
        success: true,
        err: 0,
        msg: products.length ? 'OK' : 'No products found.',
        status: 200,
        response: {
          total,
          products: productsWithVariantCount,
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
