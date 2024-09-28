const ProductV2 = require('../../../model/product_v2');
const ProductVariant = require('../../../model/product_v2/productVariant'); 
const { uploadImage } = require('../../../utils/uploadImage');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('./sku/skuGenerator');
const { RESPONSE_MESSAGES, STATUS_CODES } = require('./constants');
const addVariant = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { 
      variant_name, 
      variant_description, 
      variant_price, 
      battery, 
      color, 
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
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        err: 1,
        msg: RESPONSE_MESSAGES.PRODUCT_NOT_FOUND,
        status: STATUS_CODES.NOT_FOUND,
      });
    }

    if (variant_name === product.product_name) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        err: 1,
        msg: RESPONSE_MESSAGES.VARIANT_NAME_DUPLICATE_PRODUCT,
        status: STATUS_CODES.BAD_REQUEST,
      });
    }
    const existingVariantByName = await ProductVariant.findOne({ variant_name, product: product_id });
    if (existingVariantByName) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        err: 1,
        msg: RESPONSE_MESSAGES.VARIANT_NAME_EXISTS(variant_name),
        status: STATUS_CODES.BAD_REQUEST,
      });
    }
    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }
    const newVariant = new ProductVariant({
      variant_name,
      status,
      sku: generateSKU(variant_name),
      pid,
      variant_description,
      variant_price,
      battery, 
      color,  
      cpu,  
      graphicsCard,  
      operatingSystem, 
      ram,  
      screen, 
      storage,
      image: imageUrls,
      product: product_id 
    });

    await newVariant.save();
    product.variants.push(newVariant._id);
    await product.save();
    return res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      err: 0,
      msg: RESPONSE_MESSAGES.VARIANT_ADDED_SUCCESS,
      status: STATUS_CODES.SUCCESS,
      variant: newVariant,
    });
    
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      err: 1,
      msg: RESPONSE_MESSAGES.VARIANT_ADD_ERROR,
      status: STATUS_CODES.SERVER_ERROR,
      error: error.message,
    });
  }
};

module.exports = {
  addVariant
};



