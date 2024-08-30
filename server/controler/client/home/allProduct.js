const modelProduct = require('../../../model/product_v2');
const mongoose = require('mongoose'); 
const homeAllProduct = async (req, res) => {
  try {
    const products = await modelProduct.find({ status: { $ne: 'disable' } });
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Lỗi',
      status: 500,
      error: error.message,
    });
  }
};

const getID = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await modelProduct.findById(id);
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      product, 
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 3,
      msg: 'Lỗi hệ thống',
      status: 500,
      error: error.message,
    });
  }
};


const shopping = async (req, res) => {
  try {
    // Lấy product_format từ tham số URL
    const { product_format } = req.params;

    // Kiểm tra và chuyển đổi ID thành ObjectId nếu cần
    if (!mongoose.Types.ObjectId.isValid(product_format)) {
      return res.status(400).json({
        success: false,
        err: 2,
        msg: 'Invalid ObjectId format for product_format',
        status: 400,
      });
    }

    // Chuyển đổi ID thành ObjectId
    const objectId = new mongoose.Types.ObjectId(product_format);

    // Tìm tất cả sản phẩm có product_format tương ứng với ObjectId
    const products = await modelProduct.find({ product_format: objectId });

    // Nếu không tìm thấy sản phẩm nào
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'No products found with the specified product_format ID',
        status: 404,
      });
    }

    // Trả về danh sách sản phẩm
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Products retrieved successfully',
      status: 200,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error); // Ghi log lỗi để tiện debug

    return res.status(500).json({
      success: false,
      err: 3,
      msg: 'Internal server error',
      status: 500,
      error: error.message,
    });
  }
};
const auction = async (req, res) => {
  try {
    // Lấy product_format từ tham số URL
    const { product_format } = req.params;

    // Kiểm tra và chuyển đổi ID thành ObjectId nếu cần
    if (!mongoose.Types.ObjectId.isValid(product_format)) {
      return res.status(400).json({
        success: false,
        err: 2,
        msg: 'Invalid ObjectId format for product_format',
        status: 400,
      });
    }

    // Chuyển đổi ID thành ObjectId
    const objectId = new mongoose.Types.ObjectId(product_format);

    // Tìm tất cả sản phẩm có product_format tương ứng với ObjectId
    const products = await modelProduct.find({ product_format: objectId });

    // Nếu không tìm thấy sản phẩm nào
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'No products found with the specified product_format ID',
        status: 404,
      });
    }

    // Trả về danh sách sản phẩm
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Products retrieved successfully',
      status: 200,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error); // Ghi log lỗi để tiện debug

    return res.status(500).json({
      success: false,
      err: 3,
      msg: 'Internal server error',
      status: 500,
      error: error.message,
    });
  }
};



module.exports = {
  homeAllProduct,
  getID,
  shopping,
  auction
};
