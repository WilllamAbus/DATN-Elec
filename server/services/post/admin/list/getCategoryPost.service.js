const CategoryPost = require('../../../../model/post/categoryPost');

const CategoryPostService = {
  getCategoryPostService: (page = 1, search, limit = 5) => new Promise(async (resolve, reject) => {
    try {
      const offset = (page - 1) * limit;
      const searchQuery = search
        ? {  status: 'active',
            name: { $regex: search, $options: 'i' }, 
          }
          : { status: 'active' };

      const categories = await CategoryPost.find(searchQuery)
        .skip(offset)
        .limit(limit)
        .lean(); 

      const total = await CategoryPost.countDocuments(searchQuery);

      resolve({
        success: true,
        err: 0,
        msg: categories.length ? 'OK' : 'Không tìm thấy danh mục nào.',
        status: 200,
        response: {
          total,
          categories,
        },
      });
    } catch (error) {
      reject({
        success: false,
        err: 1,
        msg: 'Không thể lấy danh sách danh mục: ' + error.message,
        status: 500,
      });
    }
  }),
};

module.exports = CategoryPostService;
