const ProductV2 = require('../../../model/product_v2');
const ProductVariant = require('../../../model/product_v2/productVariant'); 
const Discount = require('../../../model/discount.model');
const { uploadImage } = require('../../../utils/uploadImage');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('./sku/skuGenerator');

const addVariant = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { 
      variant_name, 
      variant_description, 
      variant_original_price, 
      product_discount, 
      battery, 
      cpu, 
      graphicsCard, 
      operatingSystem, 
      ram, 
      screen, 
      storage, 
      status = 'active', 
      pid = uuidv4() 
    } = req.body;

    const product = await ProductV2.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Sản phẩm không tồn tại',
        status: 404,
      });
    }

    if (variant_name === product.product_name) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Tên biến thể không được trùng với tên sản phẩm gốc',
        status: 400,
      });
    }
    
    const existingVariantByName = await ProductVariant.findOne({ variant_name, product: product_id });
    if (existingVariantByName) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: `Tên biến thể '${variant_name}' đã tồn tại cho sản phẩm này`,
        status: 400,
      });
    }

    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }

    let discountPercent = 0;
    if (product_discount) {
      const discount = await Discount.findById(product_discount);
      if (discount && discount.isActive) {
        discountPercent = discount.discountPercent;
      }
    }

    const variant_price = Math.round(variant_original_price * (1 - discountPercent / 100));

    const newVariant = new ProductVariant({
      variant_name,
      variant_description,
      variant_price, 
      variant_original_price, 
      product_discount, 
      battery, 
      cpu,  
      graphicsCard,  
      operatingSystem, 
      ram,  
      screen, 
      storage,
      status,
      sku: generateSKU(variant_name),
      pid,
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
      variant: newVariant,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm biến thể sản phẩm',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addVariant
};
