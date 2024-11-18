const Imagevariant = require('../../../../model/product_v2/imagevariant');

const ImageByVariantIdService = {
  getImageByVariantId: async (variantId, page = 1, limit = 2) => {
    try {
  
      page = Math.max(parseInt(page, 10), 1); 
      limit = Math.max(parseInt(limit, 10), 1); 
      const offset = (page - 1) * limit;

      if (limit <= 0 || page <= 0) {
        return {
          success: false,
          err: 1,
          msg: 'Giá trị limit hoặc page không hợp lệ.',
          status: 400,
        };
      }

      const images = await Imagevariant.find({ productVariant: variantId })
       .populate('color')
       .populate('productVariant', 'variant_name')
        .skip(offset)
        .limit(limit)
        .lean();

      if (!images || images.length === 0) {
        return {
          success: false,
          err: 1,
          msg: 'Không có ảnh cho biến thể này.',
          status: 404,
        };
      }

      const total = await Imagevariant.countDocuments({ productVariant: variantId });
      const imageCountOnPage = images.length;
      return {
        success: true,
        err: 0,
        msg: 'OK',
        status: 200,
        response: {
          images,
          total,
          imageCountOnPage
        },
      };
    } catch (error) {
      return {
        success: false,
        err: 1,
        msg: 'Lỗi khi lấy ảnh: ' + error.message,
        status: 500,
      };
    }
  },
};

module.exports = ImageByVariantIdService;
