const CategoryPost = require('../../../../model/post/categoryPost');
const { checkCategoryNameExists,isValidCategoryName } = require('../validators/addCategoryPostCheck');
const { convertToLocalTime } = require('../../../../utils/timeConverter'); 
const generateSKU = require('../../../../utils/generateSKU');
const { v4: uuidv4 } = require('uuid');
const { uploadImage } = require('../../../../utils/uploadImage');
const addCategoryPost = async (req, res) => {
  try {
    console.log("Yêu cầu đến với dữ liệu:", req.body); 
    console.log(`Đang kiểm tra tính hợp lệ của tên danh mục: ${req.body.name}`);

    const existingCategory = await checkCategoryNameExists(req.body.name);
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Danh mục với tên này đã tồn tại',
        status: 400
      });
    }
    if (!isValidCategoryName(req.body.name)) {
      return res.status(400).json({
        success: false,
        err: 3,
        msg: 'Tên danh mục không hợp lệ',
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
    const newCategory = new CategoryPost({
      name: req.body.name,
      sku: generateSKU(req.body.name), 
      image: imageUrls,
      pid: req.body.pid || uuidv4(),
      
    });
    await newCategory.save();
    const categoryData = newCategory.toObject();
    categoryData.createdAt = convertToLocalTime(categoryData.createdAt); 
    categoryData.updatedAt = convertToLocalTime(categoryData.updatedAt); 
    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Danh mục mới đã được thêm thành công',
      status: 201,
      category: categoryData, 
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm danh mục',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addCategoryPost,
};
