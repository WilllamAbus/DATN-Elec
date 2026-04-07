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
      return res.status(STATUS_NOT_FOUND).json(createErrorResponse('Không tìm thấy màu nào', STATUS_NOT_FOUND));
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
    return res.status(STATUS_INTERNAL_ERROR).json(createErrorResponse('Lỗi khi truy xuất dữ liệu', STATUS_INTERNAL_ERROR));
  }
};

module.exports = { getAllColor };
