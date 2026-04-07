const ProductV2 = require('../../../model/product_v2');
const { uploadImage } = require('../../../utils/uploadImage');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('./sku/skuGenerator');
const {
  checkProductNameExists,
  isValidProductName
} = require('./validators');
const add = async (req, res) => {
  try {
    const hasVariants = req.body.hasVariants;
    const existingProduct = await checkProductNameExists(req.body.product_name);
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Sản phẩm với tên này đã tồn tại',
        status: 400
      });
    }


    if (!isValidProductName(req.body.product_name)) {
      return res.status(400).json({
        success: false,
        err: 3,
        msg: 'Tên sản phẩm không hợp lệ',
        status: 400
      });
    }

    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }

    const newProduct = new ProductV2({
      product_name: req.body.product_name,
      status: req.body.status || 'active',
      sku: generateSKU(req.body.product_name),
      pid: req.body.pid || uuidv4(),
      image: imageUrls,
      product_description: req.body.product_description,
      product_type: req.body.product_type,
      product_brand: req.body.product_brand,
      product_condition: req.body.product_condition,
      weight_g: req.body.weight_g,
      product_supplier: req.body.product_supplier,
      hasVariants: req.body.hasVariants,
      variants: [],
      hasVariants: hasVariants, 
    });
    await newProduct.save();
    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Sản phẩm mới đã được thêm thành công',
      status: 201,
      product: newProduct,
    });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm sản phẩm',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  add,
};
