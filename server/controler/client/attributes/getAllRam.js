const modelRam = require('../../../model/attributes/ram');
const {
  createErrorResponse,
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_ERROR
} = require('./error');

const getAllRam = async (req, res) => {
  try {
    const rams = await modelRam.find({ status: { $ne: 'disable' } });
    const total = await modelRam.countDocuments({ status: { $ne: 'disable' } });
    
    if (rams.length === 0) {
      return res.status(STATUS_NOT_FOUND).json(createErrorResponse('Không tìm thấy RAM nào', STATUS_NOT_FOUND));
    }
    return res.status(STATUS_OK).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: STATUS_OK,
      total,
      rams,
    });
  } catch (error) {
    return res.status(STATUS_INTERNAL_ERROR).json(createErrorResponse('Lỗi khi truy xuất dữ liệu', STATUS_INTERNAL_ERROR));
  }
};

module.exports = { getAllRam };
;

