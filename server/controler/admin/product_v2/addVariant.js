const ProductV2 = require('../../../model/product_v2');
const { uploadImage } = require('../../../utils/uploadImage');

const addVariant = async (req, res) => {
  try {
    const { product_id } = req.params;
    const {
      variant_name,
      variant_description,
      variant_price,
      variant_quantity,
      variant_attributes,
      variant_image,
      sku,
      variant_color,
      isActive
    } = req.body;

    const product = await ProductV2.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Sản phẩm không tồn tại',
        status: 404
      });
    }

    if (variant_name === product.product_name) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Tên biến thể không được trùng với tên sản phẩm gốc',
        status: 400
      });
    }

    const existingColorAttribute = product.product_attributes.find(attr => attr.k === 'Color' && attr.v === variant_color);
    if (existingColorAttribute) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Màu sắc của biến thể không được trùng với màu sắc của sản phẩm gốc',
        status: 400
      });
    }

    let imageUrls = [];
    if (variant_image && variant_image.length) {
      for (const file of variant_image) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }

    const newVariant = {
      variant_name,
      variant_description,
      variant_price,
      variant_quantity,
      variant_attributes: variant_attributes.map(attr => ({
        k: attr.k,
        v: attr.v
      })),
      variant_image: imageUrls,
      sku,
      variant_color,
      isActive
    };

    product.variants.push(newVariant);

    await product.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Biến thể mới đã được thêm thành công',
      status: 201,
      product
    });
  } catch (error) {
    console.error('Lỗi khi thêm biến thể sản phẩm:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm biến thể sản phẩm',
      status: 500,
      error: error.message
    });
  }
};

module.exports = {
  addVariant
};
