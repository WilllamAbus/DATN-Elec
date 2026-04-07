const modelOperatingSystem = require('../../../model/attributes/operatingSystem');
const {
  createErrorResponse,
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_ERROR
} = require('./error');

const getAllOperatingSystem = async (req, res) => {
  try {
    const operatingSystems = await modelOperatingSystem.find({ status: { $ne: 'disable' } });
    const total = await modelOperatingSystem.countDocuments({ status: { $ne: 'disable' } });
    
    if (operatingSystems.length === 0) {
      return res.status(STATUS_NOT_FOUND).json(createErrorResponse('Không tìm thấy hệ điều hành nào', STATUS_NOT_FOUND));
    }

    return res.status(STATUS_OK).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: STATUS_OK,
      total,
      operatingSystems,
    });
  } catch (error) {
    return res.status(STATUS_INTERNAL_ERROR).json(createErrorResponse('Lỗi khi truy xuất dữ liệu', STATUS_INTERNAL_ERROR));
  }
};

module.exports = { getAllOperatingSystem };
