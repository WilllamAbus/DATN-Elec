const modelBattery = require('../../../model/attributes/battery');
const {
  createErrorResponse,
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_ERROR
} = require('./error');

const getAllBattery = async (req, res) => {
  try {
    const batteries = await modelBattery.find({ status: { $ne: 'disable' } });
    const total = await modelBattery.countDocuments({ status: { $ne: 'disable' } });
    if (batteries.length === 0) {
      return res.status(STATUS_NOT_FOUND).json(createErrorResponse('Không tìm thấy pin nào', STATUS_NOT_FOUND));
    }
    return res.status(STATUS_OK).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: STATUS_OK,
      total,
      batteries,
    });
  } catch (error) {
    return res.status(STATUS_INTERNAL_ERROR).json(createErrorResponse('Lỗi khi truy xuất dữ liệu', STATUS_INTERNAL_ERROR));
  }
};

module.exports = { getAllBattery };
