const ImageVariant = require('../../../model/product_v2/imagevariant');
const { uploadImage } = require('../../../utils/uploadImage');
const ProductVariant = require('../../../model/product_v2/productVariant');

const addImageVariant = async (req, res) => {
  try {
    let { color } = req.body;
    const { product_variant_id } = req.params;

    if (!Array.isArray(color)) {
      color = [color];
    }

    if (!product_variant_id) {
      return res.status(400).json({ success: false, msg: 'Thiếu ID biến thể của sản phẩm', status: 400 });
    }

    const productVariant = await ProductVariant.findById(product_variant_id).populate('color', '_id name code').lean();
    if (!productVariant) {
      return res.status(404).json({ success: false, msg: 'Không tìm thấy biến thể sản phẩm', status: 404 });
    }



    const existingImageVariant = await ImageVariant.find({ productVariant: product_variant_id, color: { $in: color } }).populate('color', '_id name code');
    if (existingImageVariant.length > 0) {
      return res.status(400).json({ success: false, msg: 'Màu sắc đã tồn tại trong biến thể hình ảnh', duplicateColors: existingImageVariant.map(variant => variant.color) });
    }

    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }

    const newImageVariant = new ImageVariant({
      image: imageUrls,
      productVariant: productVariant._id,
      color: color,
    });
    const savedImageVariant = await newImageVariant.save();

    // Thêm ID của biến thể hình ảnh vào mảng image của productVariant
    productVariant.image = productVariant.image || [];
    productVariant.image.push(savedImageVariant._id);

    // Cập nhật trường color cho productVariant
    productVariant.color = [...new Set([...productVariant.color.map(c => c._id.toString()), ...color.map(c => c.toString())])];

    await ProductVariant.findByIdAndUpdate(product_variant_id, { 
      image: productVariant.image,
      color: productVariant.color // Cập nhật cả trường color
    }, { new: true });

    return res.status(201).json({ success: true, msg: 'Đã thêm thành công', imageVariant: savedImageVariant });
  } catch (error) {
    return res.status(500).json({ success: false, msg: 'Đã xảy ra lỗi', error: error.message });
  }
};

module.exports = {
  addImageVariant,
};
