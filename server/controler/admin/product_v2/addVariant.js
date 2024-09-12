const ProductV2 = require('../../../model/product_v2');
const ProductVariant = require('../../../model/product_v2/productVariant'); 
const { uploadImage } = require('../../../utils/uploadImage');

const addVariant = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { variant_name, variant_description, variant_price, variant_attributes, image } = req.body;

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

    const existingVariantByName = await ProductVariant.findOne({ variant_name, product: product_id });
    if (existingVariantByName) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: `Tên biến thể '${variant_name}' đã tồn tại cho sản phẩm này`,
        status: 400
      });
    }

    const attributeKeys = new Set();
    if (Array.isArray(variant_attributes)) {
      variant_attributes.forEach(attr => attributeKeys.add(`${attr.k}:${attr.v}`));
    }

    for (const existingVariantId of product.variants) {
      const existingVariant = await ProductVariant.findById(existingVariantId);
      if (existingVariant) {
        const existingAttributes = existingVariant.variant_attributes.map(attr => `${attr.k}:${attr.v}`);
        const existingSet = new Set(existingAttributes);
        
        for (const keyValue of attributeKeys) {
          if (existingSet.has(keyValue)) {
            return res.status(400).json({
              success: false,
              err: 1,
              msg: `Thuộc tính với giá trị '${keyValue}' đã tồn tại trong một biến thể khác`,
              status: 400
            });
          }
        }
      }
    }

    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }
    let parsedAttributes = [];
    if (typeof variant_attributes === 'string') {
      parsedAttributes = JSON.parse(variant_attributes);
    } else {
      parsedAttributes = variant_attributes;
    }

    parsedAttributes = parsedAttributes.map(attr => ({
      k: attr.k,
      v: attr.v,
    }));
    
    const newVariant = new ProductVariant({
      variant_name,
      variant_description,
      variant_price,
      variant_attributes: parsedAttributes, 
      image: imageUrls,
      product: product_id 
    });

    await newVariant.save();

    product.variants.push(newVariant._id);

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
