const Imagevariant = require('../../../../model/product_v2/imagevariant');
const ProductVariant = require('../../../../model/product_v2/productVariant');

const DeleteImageVariantService = {

  deleteImage: async (imageId, variantId) => {
    try {
      // Tìm ảnh theo imageId
      const image = await Imagevariant.findById(imageId);
      if (!image) {
        return {
          success: false,
          err: 1,
          msg: 'Không tìm thấy ảnh cần xoá.',
          status: 404,
        };
      }
      const colorId = image.color;
      // Xoá ảnh khỏi ImageVariant
      await Imagevariant.findByIdAndDelete(imageId);

      // Xoá ID ảnh khỏi danh sách hình ảnh của ProductVariant
      await ProductVariant.findByIdAndUpdate(
        variantId,
        { $pull: { image: imageId } },
        { new: true }
      );
      const productVariant = await ProductVariant.findById(variantId);
      if (productVariant) {
        const colorExists = productVariant.color.includes(colorId);

        // Kiểm tra nếu không còn hình ảnh nào thuộc color này thì xóa color luôn
        const remainingImages = await Imagevariant.find({
          productVariant: variantId,
          color: colorId,
        });
        if (colorExists && remainingImages.length === 0) {
          await ProductVariant.findByIdAndUpdate(
            variantId,
            { $pull: { color: colorId } },
            { new: true }
          );
        }
      }
      return {
        success: true,
        err: 0,
        msg: 'Xoá ảnh thành công.',
        status: 200,
      };
    } catch (error) {
      return {
        success: false,
        err: 1,
        msg: 'Lỗi khi xoá ảnh: ' + error.message,
        status: 500,
      };
    }
  },
};

module.exports = DeleteImageVariantService;
