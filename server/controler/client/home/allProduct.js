const modelProduct = require('../../../model/product_v2');

const Repcomment = require('../../../model/repComment.model');
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
    const products = await modelProduct.find({ product_format: objectId, status: { $ne: "disable" } });

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
const upView = async (req, res) => {
  try {
    const { id } = req.params;
    // Tìm sản phẩm theo ID
    const product = await modelProduct.findById(id);
    if (!product) {
        console.error('Product not found with id:', id);
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    // Tăng số lượng lượt xem của sản phẩm
    product.product_view = (product.product_view || 0) + 1;

    // Chỉ cập nhật trường 'product_view', bỏ qua các trường khác
    await product.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: 'View count incremented successfully',
        data: product
    });
  } catch (error) {
    console.error('Error during view count increment:', error);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message
    });
  }
};


const search = async (req, res) => {
  try {
    const keyword = req.params.keyword.trim(); 

    // Điều kiện không thực hiện tìm kiếm với từ khóa quá ngắn
    if (keyword.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Keyword must be at least 3 characters long"
      });
    }

    // Truy vấn chỉ tìm kiếm các sản phẩm khớp với từ khóa
    const result = await modelProduct.find({
      product_name: { $regex: `${keyword}`, $options: 'i' } // Bắt đầu với từ khóa (case-insensitive)
    }).populate({
      path: 'variants',
      select: 'variant_price product_discount variant_original_price',
      populate: [
        { path: 'storage', select: 'name' },
        { path: 'ram', select: 'name' },
        { path: 'product_discount', select: 'discountPercent' }
      ]
    });

    if (result.length > 0) {
      res.status(200).json({
        success: true,
        data: result
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No results found"
      });
    }
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};



const comment = async (req, res) => {
  try {
      let { content, id_product, id_user, rating, createdAt } = req.body;

      if (!content || !id_product|| !id_user || !rating) {
          return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
      }

      createdAt = createdAt ? new Date(createdAt) : new Date();

    
          await saveComment();

      async function saveComment() {
          let data = { content, id_product, id_user, rating, createdAt };

          // Save to database
          const savedProduct = await modelComment.create(data);
          res.status(201).json({ message: "Sản phẩm được tạo thành công", savedProduct });
      }
  } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};


module.exports = {
  homeAllProduct,
  getID,
  shopping,
  auction,
  upView,
  search,
  comment,
};
