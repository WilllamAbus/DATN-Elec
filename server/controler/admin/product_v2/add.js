const ProductV2 = require('../../../model/product_v2');
const Discount = require('../../../model/discount.model');
const { uploadImage } = require('../../../utils/uploadImage');
const { calculateDiscount } = require('./calculator/discount');
const { 
  checkProductNameExists, 
  validateProductPrice,
  isValidProductName 
} = require('./validators');
const add = async (req, res) => {

  try {
  
    const existingProduct = await checkProductNameExists(req.body.product_name);
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Sản phẩm với tên này đã tồn tại',
        status: 400
      });
    }
    const productPrice = parseFloat(req.body.product_price);
    if (!validateProductPrice(productPrice)) {
      return res.status(400).json({
        success: false,
        err: 2,
        msg: 'Giá tiền không hợp lệ',
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
    const { discount, productPriceUnit } = await calculateDiscount(req.body.product_discount, productPrice);

    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }
    let productAttributes = [];
    if (typeof req.body.product_attributes === 'string') {
      productAttributes = JSON.parse(req.body.product_attributes);
    } else {
      productAttributes = req.body.product_attributes;
    }

    productAttributes = productAttributes.map(attr => ({
      k: attr.k,
      v: attr.v,
    }));
    
    const newProduct = new ProductV2({
      product_name: req.body.product_name,
      image: imageUrls,
      product_description: req.body.product_description,
      product_type: req.body.product_type,
      product_discount: {
        discountId: discount._id,
        code: discount.code,
        discountPercent: discount.discountPercent,
        isActive: discount.isActive,
        status: discount.status,
        disabledAt: discount.disabledAt
      },
      product_brand: req.body.product_brand,
      product_format: req.body.product_format,
      product_condition: req.body.product_condition,
      product_price: productPrice, 
      product_price_unit: productPriceUnit, 
      product_attributes: productAttributes, 
      weight_g: req.body.weight_g,
      product_supplier: req.body.product_supplier,
    });

    await newProduct.save();

    return res.status(201).json({
      success:true,
      err:0,
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
