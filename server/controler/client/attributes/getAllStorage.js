const modelStorage = require('../../../model/attributes/storage');
const {
  createErrorResponse,
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_ERROR
} = require('./error');

const getAllStorage = async (req, res) => {
  try {
    const storages = await modelStorage.find({ status: { $ne: 'disable' } });
    const total = await modelStorage.countDocuments({ status: { $ne: 'disable' } });
    
    if (storages.length === 0) {
      return res.status(STATUS_NOT_FOUND).json(createErrorResponse('Không tìm thấy bộ nhớ nào', STATUS_NOT_FOUND));
    }
    
    return res.status(STATUS_OK).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: STATUS_OK,
      total,
      storages,
    });
  } catch (error) {
    return res.status(STATUS_INTERNAL_ERROR).json(createErrorResponse('Lỗi khi truy xuất dữ liệu', STATUS_INTERNAL_ERROR));
  }
};

module.exports = { getAllStorage };
