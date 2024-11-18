const PostService = require('../../../../services/post/admin/list/getPost.Service');

const listPost = async (req, res) => {
  const { page, search } = req.query;
  const limit = 5; 

  try {
    const response = await PostService.getPostService(page, search, limit);

    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi khi lấy danh sách bài viết',
        status: 400,
      });
    }

    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(response.response.total / limit);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      data: response.response,
      pagination: {
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error('Error:', error);

    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Lỗi: ' + error.message,
      status: 500,
    });
  }
};

module.exports = {
  listPost,
};
