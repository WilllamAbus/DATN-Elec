  const DeleteImageVariantService = require('../../../services/product/admin/product-variant/deleteImageVariant.Service');

  const deleteImageVariant = async (req, res) => {
    const { imageId, variantId } = req.params;

    try {
      const response = await DeleteImageVariantService.deleteImage(imageId, variantId);

      if (response.err) {
        return res.status(response.status || 400).json({
          success: false,
          err: response.err,
          msg: response.msg || 'Lỗi',
          status: response.status || 400,
        });
      }

      return res.status(200).json({
        success: true,
        msg: response.msg,
        status: 200,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        err: -1,
        msg: 'Lỗi server: ' + error.message,
        status: 500,
      });
    }
  };

  module.exports = {
    deleteImageVariant,
  };
