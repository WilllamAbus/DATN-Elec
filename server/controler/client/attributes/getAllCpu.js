const modelCpu = require('../../../model/attributes/cpu');
const {
  createErrorResponse,
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_ERROR
} = require('./error');

const getAllCpu = async (req, res) => {
  try {
    const cpus = await modelCpu.find({ status: { $ne: 'disable' } });
    const total = await modelCpu.countDocuments({ status: { $ne: 'disable' } });

    if (cpus.length === 0) {
      return res.status(STATUS_NOT_FOUND).json(createErrorResponse('Không tìm thấy CPU nào', STATUS_NOT_FOUND));
    }

    return res.status(STATUS_OK).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: STATUS_OK,
      total,
      cpus,
    });
  } catch (error) {
    return res.status(STATUS_INTERNAL_ERROR).json(createErrorResponse('Lỗi khi truy xuất dữ liệu', STATUS_INTERNAL_ERROR));
  }
};

module.exports = { getAllCpu };
