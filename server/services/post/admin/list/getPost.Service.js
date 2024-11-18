const Post = require('../../../../model/post/post');

const PostService = {
  getPostService: (page, search, limit = 5) => new Promise(async (resolve, reject) => {
    try {
      const offset = (page - 1) * limit;
      const searchQuery = search
        ? { 
            title: { $regex: search, $options: 'i' }, 
            status: 'active'
          }
        : { status: 'active' };

      const posts = await Post.find(searchQuery)
        .populate('product', 'name') 
        .populate('category', 'name') 
        .skip(offset)
        .limit(limit)
        .lean();

      const total = await Post.countDocuments(searchQuery);

      resolve({
        success: true,
        err: 0,
        msg: posts.length ? 'OK' : 'Không tìm thấy bài viết nào.',
        status: 200,
        response: {
          total,
          posts,
        },
      });
    } catch (error) {
      reject({
        success: false,
        err: 1,
        msg: 'Không thể lấy danh sách bài viết: ' + error.message,
        status: 500,
      });
    }
  }),
};

module.exports = PostService;
