const Post = require("../../../../model/post/post");
const Product = require('../../../../model/product_v2');
const { uploadImage } = require("../../../../utils/uploadthumbnail");
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../../attributes/sku/skuGenerator');
const CategoryPost = require('../../../../model/post/categoryPost');
const { checkPostTitleExists } = require("../validators/addPostCheck");
const { convertToLocalTime } = require('../../../../utils/timeConverter');

const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, product, category, status } = req.body;

    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: "Bài viết không tồn tại",
        status: 404
      });
    }

    if (title && title !== existingPost.title) {
      const postWithSameTitle = await checkPostTitleExists(title);
      if (postWithSameTitle && postWithSameTitle._id.toString() !== postId) {
        return res.status(400).json({
          success: false,
          err: 2,
          msg: "Tiêu đề bài viết đã tồn tại",
          status: 400,
        });
      }
    }


    const validateCategory = async (categoryId) => {
      const category = await CategoryPost.findById(categoryId);
      return !!category;
    };
    if (!await validateCategory(category)) {
      return res.status(400).json({
        success: false,
        err: 3,
        msg: "Danh mục không hợp lệ",
        status: 400
      });
    }

    let thumbnailUrls = existingPost.thumbnail;
    if (req.files && req.files.length) {
      thumbnailUrls = [];
      for (const file of req.files) {
        const uploadedUrl = await uploadImage(file);
        thumbnailUrls.push(uploadedUrl);
      }
    }

    existingPost.title = title || existingPost.title;
    existingPost.content = content || existingPost.content;
    existingPost.product = product || existingPost.product;
    existingPost.category = category || existingPost.category;
    existingPost.thumbnail = thumbnailUrls;
    existingPost.sku = generateSKU(title || existingPost.title);
    await existingPost.save();

    if (product && product !== existingPost.product.toString()) {
      const oldProduct = await Product.findById(existingPost.product);
      if (oldProduct) {
        oldProduct.posts = null;
        await oldProduct.save();
      }

      const newProduct = await Product.findById(product);
      if (newProduct) {
        newProduct.posts = existingPost._id;
        await newProduct.save();
      }
    }

    const updatedPostData = existingPost.toObject();
    updatedPostData.createdAt = convertToLocalTime(updatedPostData.createdAt);
    updatedPostData.updatedAt = convertToLocalTime(updatedPostData.updatedAt);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: "Bài viết đã được cập nhật thành công",
      status: 200,
      post: updatedPostData
    });
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa bài viết:", error);
    return res.status(500).json({
      success: false,
      err: 4,
      msg: "Có lỗi xảy ra khi chỉnh sửa bài viết",
      status: 500,
      error: error.message
    });
  }
};

module.exports = {
  editPost
};
