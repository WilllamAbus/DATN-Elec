const ProductAuction = require('../../../../model/productAuction/productAuction');
const ProductAuctionService = {
  getDeleteListProductAuctionService: (page = 1, limit = 5, search) => new Promise(async (resolve, reject) => {
    try {
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

      const matchStage = search
        ? {
            $match: {
              status: 'disable', 
              product_name: { $regex: search, $options: 'i' },
            },
          }
        : {
            $match: { status: 'disable' },
          };

      const productAuction = await ProductAuction.aggregate([
        matchStage,
        {
          $lookup: {
            from: 'categories',
            localField: 'product_type',
            foreignField: '_id',
            as: 'product_type',
          },
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'product_brand',
            foreignField: '_id',
            as: 'product_brand',
          },
        },
        {
          $lookup: {
            from: 'conditionShopping',
            localField: 'product_condition',
            foreignField: '_id',
            as: 'product_condition',
          },
        },
        {
          $lookup: {
            from: 'suppliers',
            localField: 'product_supplier',
            foreignField: '_id',
            as: 'product_supplier',
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            product_name: 1,
            image: 1,
            product_description: 1,
            product_slug: 1,
            product_discount: 1,
            product_type: { $arrayElemAt: ['$product_type', 0] },
            product_brand: { $arrayElemAt: ['$product_brand', 0] },
            product_condition: { $arrayElemAt: ['$product_condition', 0] },
            product_supplier: { $arrayElemAt: ['$product_supplier', 0] },
            product_quantity: 1,
            product_ratingAvg: 1,
            product_view: 1,
            product_price: 1,
            product_price_unit: 1,
            product_attributes: 1,
            weight_g: 1,
            isActive: 1,
            status: 1,
            disabledAt: 1,
            comments: 1,
            createdAt: 1,
            updatedAt: 1,
            slug: 1,
            __v: 1,
          },
        },
      ]);

      const totalResult = await ProductAuction.aggregate([
        matchStage,
        {
          $count: "total"
        }
      ]);

      const total = totalResult.length ? totalResult[0].total : 0;

      resolve({
        success: true,
        err: 0,
        msg: productAuction.length ? 'OK' : 'Không tìm thấy sản phẩm nào.',
        status: 200,
        response: {
          total,
          productAuction,
        },
      });

    } catch (error) {
      console.error('Error:', error);
      reject({
        success: false,
        err: 1,
        msg: 'Không có sản phẩm bị xóa: ' + (error.message || 'Đã xảy ra lỗi không xác định'),
        status: 500,
      });
    }
  }),
};

module.exports = ProductAuctionService;
