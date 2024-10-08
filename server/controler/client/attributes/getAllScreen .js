const modelScreen = require('../../../model/attributes/screen');
const {
  createErrorResponse,
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_ERROR
} = require('./error');

const getAllScreen = async (req, res) => {
  try {
    const screens = await modelScreen.find({ status: { $ne: 'disable' } });
    const total = await modelScreen.countDocuments({ status: { $ne: 'disable' } });
    
    if (screens.length === 0) {
      return res.status(STATUS_NOT_FOUND).json(createErrorResponse('Không tìm thấy màn hình nào', STATUS_NOT_FOUND));
    }
    
    return res.status(STATUS_OK).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: STATUS_OK,
      total,
      screens,
    });
  } catch (error) {
    return res.status(STATUS_INTERNAL_ERROR).json(createErrorResponse('Lỗi khi truy xuất dữ liệu', STATUS_INTERNAL_ERROR));
  }
};

module.exports = { getAllScreen };
