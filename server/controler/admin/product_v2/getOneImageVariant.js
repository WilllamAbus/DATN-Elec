const ImageVariant = require('../../../model/product_v2/imagevariant');


const getOneImageVariant = async (req, res) => {
   try {
      const { image_variant_id } = req.params; 

      if (!image_variant_id) {
         return res.status(400).json({
            success: false,
            msg: 'Thiếu ID của biến thể hình ảnh',
            status: 400,
         });
      }


      const imageVariant = await ImageVariant.findById(image_variant_id)
         .populate('color', '_id name code')
         .populate('productVariant', '_id variant_name');

      if (!imageVariant) {
         return res.status(404).json({
            success: false,
            msg: 'Không tìm thấy biến thể hình ảnh',
            status: 404,
         });
      }


     

      return res.status(200).json({
         success: true,
         msg: 'Lấy thông tin thành công',
         imageVariant,
      });
   } catch (error) {
      return res.status(500).json({
         success: false,
         msg: 'Đã xảy ra lỗi',
         error: error.message,
      });
   }
};

module.exports = {
   getOneImageVariant,
};
