const ProductV2 = require('../../../model/product_v2');
const { uploadImage } = require('../../../utils/uploadImage');
const { calculateDiscount } = require('./calculator/discount');
const { 
  checkProductNameExists, 
  validateProductPrice,
  isValidProductName 
} = require('./validators');

const update = async (req, res) => {
  try {
    const productId = req.params.id; // Lấy ID sản phẩm từ tham số URL

    // Tìm sản phẩm theo ID
    const existingProduct = await ProductV2.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Sản phẩm không tồn tại',
        status: 404
      });
    }

    // Kiểm tra sự tồn tại của tên sản phẩm (nếu tên sản phẩm đã thay đổi)
    if (req.body.product_name && req.body.product_name !== existingProduct.product_name) {
      const nameExists = await checkProductNameExists(req.body.product_name);
      if (nameExists) {
        return res.status(400).json({
          success: false,
          err: 2,
          msg: 'Sản phẩm với tên này đã tồn tại',
          status: 400
        });
      }
    }

    // Validate giá sản phẩm
    const productPrice = parseFloat(req.body.product_price);
    if (!validateProductPrice(productPrice)) {
      return res.status(400).json({
        success: false,
        err: 3,
        msg: 'Giá tiền không hợp lệ',
        status: 400
      });
    }

    // Kiểm tra tính hợp lệ của tên sản phẩm
    if (!isValidProductName(req.body.product_name)) {
      return res.status(400).json({
        success: false,
        err: 4,
        msg: 'Tên sản phẩm không hợp lệ',
        status: 400
      });
    }

    // Tính toán giảm giá
    const { discount, productPriceUnit } = await calculateDiscount(req.body.product_discount, productPrice);

    let imageUrls = existingProduct.image; // Giữ lại các ảnh hiện tại nếu không có ảnh mới
    if (req.files && req.files.length) {
      imageUrls = [];
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

    // Cập nhật sản phẩm
    existingProduct.product_name = req.body.product_name || existingProduct.product_name;
    existingProduct.image = imageUrls;
    existingProduct.product_description = req.body.product_description || existingProduct.product_description;
    existingProduct.product_type = req.body.product_type || existingProduct.product_type;
    existingProduct.product_discount = {
      discountId: discount._id,
      code: discount.code,
      discountPercent: discount.discountPercent,
      isActive: discount.isActive,
      status: discount.status,
      disabledAt: discount.disabledAt
    };
    existingProduct.product_brand = req.body.product_brand || existingProduct.product_brand;
    existingProduct.product_format = req.body.product_format || existingProduct.product_format;
    existingProduct.product_condition = req.body.product_condition || existingProduct.product_condition;
    existingProduct.product_quantity = req.body.product_quantity || existingProduct.product_quantity;
    existingProduct.product_price = productPrice; 
    existingProduct.product_price_unit = productPriceUnit;
    existingProduct.product_attributes = productAttributes;
    existingProduct.weight_g = req.body.weight_g || existingProduct.weight_g;
    existingProduct.product_supplier = req.body.product_supplier || existingProduct.product_supplier;

    await existingProduct.save();

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Sản phẩm đã được cập nhật thành công',
      status: 200,
      product: existingProduct
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi cập nhật sản phẩm',
      status: 500,
      error: error.message
    });
  }
};

module.exports = {
  update,
};
