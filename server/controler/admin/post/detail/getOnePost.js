const Post = require("../../../../model/post/post");
const { convertToLocalTime } = require('../../../../utils/timeConverter');

const getOnePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("product", "product_name") 
      .populate("category", "name"); 

    if (!post) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: "Không tìm thấy bài viết",
        status: 404,
      });
    }
    const postData = post.toObject();
    postData.createdAt = convertToLocalTime(postData.createdAt);
    postData.updatedAt = convertToLocalTime(postData.updatedAt);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: "Lấy thông tin bài viết thành công",
      status: 200,
      post: postData,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bài viết:", error);
    return res.status(500).json({
      success: false,
      err: 2,
      msg: "Có lỗi xảy ra khi lấy thông tin bài viết",
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  getOnePost,
};
