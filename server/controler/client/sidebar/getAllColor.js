const modelColor = require('../../../model/attributes/color');
const {
  createErrorResponse,
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_ERROR
} = require('./error');
const getAllColor = async (req, res) => {
  try {
    const colors = await modelColor.find({ status: { $ne: 'disable' } });
    const total = await modelColor.countDocuments({ status: { $ne: 'disable' } });
    if (colors.length === 0) {
      return createErrorResponse(res, STATUS_NOT_FOUND, 'Không tìm thấy màu nào');
    }
    return res.status(STATUS_OK).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: STATUS_OK,
      total,
      colors,
    });
  } catch (error) {
    return createErrorResponse(res, STATUS_INTERNAL_ERROR, 'Lỗi khi truy xuất dữ liệu');
  }
};

module.exports = { getAllColor };
