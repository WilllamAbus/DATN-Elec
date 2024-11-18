const CategoryPost = require('../../../../model/post/categoryPost'); 

const selectCategoryPost = async (req, res) => {
  try {
    const categoryPosts = await CategoryPost.find({ status: { $ne: 'disabled' } }).select('_id name');
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Chọn danh mục bài viết thành công',
      status: 200,
      categoryPosts 
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi chọn danh mục bài viết',
      status: 500,
      error: error.message, 
    });
  }
};

module.exports = {
  selectCategoryPost,
};
