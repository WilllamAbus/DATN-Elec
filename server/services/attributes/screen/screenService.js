const Screen = require('../../../model/attributes/screen');

const ScreenService = {
  getScreenService: (page, search, limit = 5) => new Promise(async (resolve, reject) => {
    try {
      const offset = (page - 1) * limit;
      const searchQuery = search
        ? { name: { $regex: search, $options: 'i' }, status: 'active' }
        : { status: 'active' };

      const screens = await Screen.find(searchQuery)
        .skip(offset)
        .limit(limit)
        .lean();

      const total = await Screen.countDocuments(searchQuery);

      resolve({
        success: true,
        err: 0,
        msg: screens.length ? 'OK' : 'Không tìm thấy màn hình nào.',
        status: 200,
        response: {
          total,
          screens,
          countOnPage: screens.length,
        },
      });
    } catch (error) {
      reject({
        success: false,
        err: 1,
        msg: 'Không thể lấy danh sách màn hình: ' + error.message,
        status: 500,
      });
    }
  }),
};

module.exports = ScreenService;
