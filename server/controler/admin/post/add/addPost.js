const Post = require("../../../../model/post/post");
const Product = require('../../../../model/product_v2');
const { uploadImage } = require("../../../../utils/uploadthumbnail");
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../../attributes/sku/skuGenerator');
const CategoryPost = require('../../../../model/post/categoryPost');
const {
  checkPostTitleExists,
} = require("../validators/addPostCheck");
const { convertToLocalTime } = require('../../../../utils/timeConverter'); 
const addPost = async (req, res) => {
  try {
    const existingPost = await checkPostTitleExists(req.body.title);
    if (existingPost) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: "Bài viết với tiêu đề này đã tồn tại",
        status: 400
      });
    }
    const validateCategory = async (categoryId) => {
      const category = await CategoryPost.findById(categoryId);
      return !!category; 
    };
    if (!validateCategory(req.body.category)) {
      return res.status(400).json({
        success: false,
        err: 2,
        msg: "Danh mục không hợp lệ",
        status: 400
      });
    }
    let thumbnailUrls = []; 
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploadedUrl = await uploadImage(file); 
        thumbnailUrls.push(uploadedUrl); 
      }
    }
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      product: req.body.product, 
      category:req.body.category,
      thumbnail: thumbnailUrls, 
      views: 0,
      status: req.body.status || "active",
      sku: generateSKU(req.body.title), 
      pid: req.body.pid || uuidv4(),
    });
    await newPost.save();
    const product = await Product.findById(req.body.product);
    if (product) {
      product.posts = newPost._id; 
      await product.save(); 
    }
    const PostData = newPost.toObject();
    PostData.createdAt = convertToLocalTime(PostData.createdAt); 
    PostData.updatedAt = convertToLocalTime(PostData.updatedAt); 
    return res.status(201).json({
      success: true,
      err: 0,
      msg: "Bài viết mới đã được thêm thành công",
      status: 201,
      post: PostData
    });
  } catch (error) {
    console.error("Lỗi khi thêm bài viết:", error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: "Có lỗi xảy ra khi thêm bài viết",
      status: 500,
      error: error.message
    });
  }
};

module.exports = {
  addPost
};
