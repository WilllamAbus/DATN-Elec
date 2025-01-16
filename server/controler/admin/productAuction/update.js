const ProducAuction = require('../../../model/productAuction/productAuction');
const { uploadImage } = require('../../../utils/uploadImage');

const { 
  checkProductNameExists, 
  isValidProductName,
  validateWeightInput
} = require('./validators');

const update = async (req, res) => {
  try {
    const productId = req.params.id;

    const existingProduct = await ProducAuction.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Sản phẩm không tồn tại',
        status: 404
      });
    }

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





    if (!isValidProductName(req.body.product_name)) {
      return res.status(400).json({
        success: false,
        err: 4,
        msg: 'Tên sản phẩm không hợp lệ',
        status: 400
      });
    }
    const weightInput = req.body.weight_g; 
    if (!validateWeightInput(weightInput)) {
      return res.status(400).json({
        success: false,
        err: 5,
        msg: 'Cân nặng sản phẩm không hợp lệ. Nó phải là một số dương và không vượt quá 1000g.',
        status: 400
      });
    }


    let imageUrls = existingProduct.image; 
    if (req.files && req.files.length) {
      imageUrls = [];
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }

    existingProduct.product_name = req.body.product_name || existingProduct.product_name;
    existingProduct.image = imageUrls;
    existingProduct.product_description = req.body.product_description || existingProduct.product_description;
    existingProduct.product_type = req.body.product_type || existingProduct.product_type;
    existingProduct.product_brand = req.body.product_brand || existingProduct.product_brand;
    existingProduct.product_condition = req.body.product_condition || existingProduct.product_condition;
    existingProduct.weight_g = weightInput;
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
