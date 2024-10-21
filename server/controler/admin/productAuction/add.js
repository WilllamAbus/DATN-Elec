const ProductAuction = require('../../../model/productAuction/productAuction');
const { uploadImage } = require('../../../utils/uploadImage');
const { calculateDiscount } = require('../product_v2/calculator/discount');
const checkProductNameExists = async (productName) => {
  const product = await ProductAuction.findOne({ product_name: productName });
  return product !== null;
};
const validateProductPrice = (price) => {
  return typeof price === 'number' && !isNaN(price) && price > 0;
};
const validateProductPriceInput = (priceInput) => {
  if (typeof priceInput === 'string') {
    if (isNaN(priceInput) || priceInput.trim() === '') {
      return false;
    }
    const priceAsNumber = parseFloat(priceInput);
    return priceAsNumber > 0;
  }

  return validateProductPrice(priceInput);
};
const validateWeight = (weight) => {
  return typeof weight === 'number' && !isNaN(weight) && weight > 0 && weight <= 1000;
};

const validateWeightInput = (weightInput) => {
  if (typeof weightInput === 'string') {
    if (isNaN(weightInput) || weightInput.trim() === '') {
      return false;
    }
    const weightAsNumber = parseFloat(weightInput);
    return weightAsNumber > 0 && weightAsNumber <= 1000;
  }

  return validateWeight(weightInput);
};
const add = async (req, res) => {

  try {

    const existingProduct = await checkProductNameExists(req.body.product_name);
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Sản phẩm với tên này đã tồn tại',
        status: 400,
      });
    }
    const productPriceInput = req.body.product_price;
    if (!validateProductPriceInput(productPriceInput)) {
      return res.status(400).json({
        success: false,
        err: 2,
        msg: 'Giá sản phẩm không hợp lệ. Nó phải là một số dương và không chứa ký tự.',
        status: 400,
      });
    }

    const productPrice = parseFloat(productPriceInput);

    const weightInput = req.body.weight_g;

    if (!validateWeightInput(weightInput)) {
      return res.status(400).json({
        success: false,
        err: 3,
        msg: 'Trọng lượng sản phẩm không hợp lệ. Nó phải là một số dương và không vượt quá 1000 gram.',
        status: 400,
      });
    }

    const weight = parseFloat(weightInput);

    const { discount, productPriceUnit } = await calculateDiscount(req.body.product_discount, productPrice);

    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }



    const newProduct = new ProductAuction({
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
      product_condition: req.body.product_condition,
      product_price: productPrice,
      product_price_unit: productPriceUnit,
      weight_g: weight,
      product_supplier: req.body.product_supplier,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Sản phẩm đấu giá đã được thêm thành công',
      status: 201,
      product: newProduct,

    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm sản phẩm đấu giá',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  add,
};
