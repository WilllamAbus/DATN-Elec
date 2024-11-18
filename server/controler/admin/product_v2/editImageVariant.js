const ImageVariant = require('../../../model/product_v2/imagevariant');
const { uploadImage } = require('../../../utils/uploadImage');
const ProductVariant = require('../../../model/product_v2/productVariant');

const editImageVariant = async (req, res) => {
   try {
      const { image_variant_id } = req.params;
      let { color } = req.body;

      // Đảm bảo `color` luôn là một mảng
      if (!Array.isArray(color)) {
         color = color ? [color] : [];
      }

      if (!image_variant_id) {
         return res.status(400).json({
            success: false,
            msg: 'Thiếu ID biến thể hình ảnh',
            status: 400,
         });
      }

      // Tìm biến thể hình ảnh theo ID
      const imageVariant = await ImageVariant.findById(image_variant_id).populate('color', '_id name code');
      if (!imageVariant) {
         return res.status(404).json({ success: false, msg: 'Không tìm thấy biến thể hình ảnh', status: 404 });
      }

      if (!Array.isArray(imageVariant.color)) {
         imageVariant.color = [];
      }

      // Kiểm tra màu sắc đã tồn tại chưa
      const existingImageVariant = await ImageVariant.find({
         productVariant: imageVariant.productVariant,
         color: { $in: color },
         _id: { $ne: image_variant_id }, // Không tính chính bản thân biến thể hiện tại
      }).populate('color', '_id name code');

      if (existingImageVariant.length > 0) {
         return res.status(400).json({
            success: false,
            msg: 'Màu sắc đã tồn tại trong biến thể hình ảnh khác',
            duplicateColors: existingImageVariant.map((variant) => variant.color),
         });
      }

      // Tải ảnh lên nếu có
      let imageUrls = [];
      if (req.files && req.files.length) {
         for (const file of req.files) {
            const imageUrl = await uploadImage(file);
            imageUrls.push(imageUrl);
         }
      } else {
         imageUrls = imageVariant.image;
      }

      // Cập nhật thông tin ImageVariant
      const oldColors = Array.isArray(imageVariant.color)
      ? imageVariant.color.map((c) => c.toString())
      : [imageVariant.color.toString()];
   
     // Đảm bảo `color` là một mảng chuỗi
imageVariant.image = imageUrls;
imageVariant.color = Array.isArray(color) ? color.map(c => c.toString()) : [color.toString()];
      const updatedImageVariant = await imageVariant.save();

      // Đồng bộ màu sắc với ProductVariant
      const productVariant = await ProductVariant.findById(imageVariant.productVariant);

      // Lấy tất cả các màu hiện đang sử dụng trong các `ImageVariant` của `ProductVariant`
      const allImageVariants = await ImageVariant.find({ productVariant: productVariant._id });
      const usedColorsSet = new Set();

      allImageVariants.forEach((variant) => {
         const variantColors = Array.isArray(variant.color) ? variant.color : [variant.color];
         variantColors.forEach((c) => usedColorsSet.add(c.toString()));
      });
      
      // Cập nhật màu sắc cho `ProductVariant`
      // Giữ nguyên các màu hiện đang sử dụng và loại bỏ những màu cũ không còn trong `usedColorsSet`
      productVariant.color = productVariant.color.filter(c => usedColorsSet.has(c.toString()));

      // Thêm những màu mới từ `color` vào nếu chưa tồn tại
      color.forEach(c => usedColorsSet.add(c.toString()));

      // Cập nhật danh sách cuối cùng cho `ProductVariant`
      productVariant.color = Array.from(usedColorsSet);

      // Lưu `ProductVariant`
      await productVariant.save();

      return res.status(200).json({
         success: true,
         msg: 'Cập nhật biến thể hình ảnh thành công và đồng bộ màu sắc với biến thể sản phẩm',
         imageVariant: updatedImageVariant,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         msg: 'Đã xảy ra lỗi',
         error: error.message,
      });
   }
};

module.exports = {
   editImageVariant,
};
