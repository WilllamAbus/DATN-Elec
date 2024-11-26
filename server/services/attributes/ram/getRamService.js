const Ram = require('../../../model/attributes/ram');

const getRamService = {
  getRamService: (page, search, limit = 5) => new Promise(async (resolve, reject) => {
    try {
      const offset = (page - 1) * limit;
      const searchQuery = search
        ? { name: { $regex: search, $options: 'i' }, status: 'active' }
        : { status: 'active' };

      const rams = await Ram.find(searchQuery)
        .skip(offset)
        .limit(limit)
        .lean();

      const total = await Ram.countDocuments(searchQuery);

      resolve({
        success: true,
        err: 0,
        msg: rams.length ? 'OK' : 'Không tìm thấy RAM nào.',
        status: 200,
        response: {
          total,
          rams,
          countOnPage: rams.length,
        },
      });
    } catch (error) {
      reject({
        success: false,
        err: 1,
        msg: 'Không thể lấy danh sách RAM: ' + error.message,
        status: 500,
      });
    }
  }),
};

module.exports = getRamService;
