
const ProductV2 = require('../../../model/product_v2');
const ProductVariant = require('../../../model/product_v2/productVariant'); 
const { uploadImage } = require('../../../utils/uploadImage');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('./sku/skuGenerator');
const Discount = require('../../../model/discount.model');
const editVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
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

    // Kiểm tra biến thể sản phẩm
    const variant = await ProductVariant.findById(variantId).populate('product');
    if (!variant) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Biến thể sản phẩm không tồn tại',
        status: 404,
      });
    }

    // Kiểm tra trùng tên với tên sản phẩm gốc
    if (variant_name === variant.product.product_name) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Tên biến thể không được trùng với tên sản phẩm gốc',
        status: 400,
      });
    }

    // Kiểm tra trùng tên với các biến thể khác của sản phẩm
    const existingVariantByName = await ProductVariant.findOne({ variant_name, product: variant.product._id, _id: { $ne: variantId  } });
    if (existingVariantByName) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: `Tên biến thể '${variant_name}' đã tồn tại cho sản phẩm này`,
        status: 400,
      });
    }

    // Xử lý ảnh mới (nếu có tệp tải lên)
    let imageUrls = variant.image; // Lấy ảnh hiện tại
    if (req.files && req.files.length) {
      imageUrls = []; // Làm rỗng danh sách ảnh trước khi cập nhật
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

    variant.variant_name = variant_name;
    variant.variant_description = variant_description;
    variant.variant_price = variant_price;
    variant.variant_original_price = variant_original_price;
    variant.product_discount = product_discount;
    variant.battery = battery;
    variant.cpu = cpu;
    variant.graphicsCard = graphicsCard;
    variant.operatingSystem = operatingSystem;
    variant.ram = ram;
    variant.screen = screen;
    variant.storage = storage;
    variant.status = status;
    variant.image = imageUrls;
    variant.pid = pid;  
    variant.sku = generateSKU(variant_name);  

    await variant.save();

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Biến thể sản phẩm đã được cập nhật thành công',
      status: 200,
      variant,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi cập nhật biến thể sản phẩm',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  editVariant
};


module.exports = {
  editVariant
};
