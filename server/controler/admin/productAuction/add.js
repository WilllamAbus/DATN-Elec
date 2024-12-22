const ProductAuction = require('../../../model/productAuction/productAuction');
const { uploadImage } = require('../../../utils/uploadImage');
const checkProductNameExists = async (productName) => {
  const product = await ProductAuction.findOne({ product_name: productName });
  return product !== null;
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
      product_brand: req.body.product_brand,
      product_condition: req.body.product_condition,
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
