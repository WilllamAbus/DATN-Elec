const modelGraphicsCard = require('../../../model/attributes/graphicsCard');
const {
  createErrorResponse,
  STATUS_OK,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_ERROR
} = require('./error');

const getAllGraphicsCard = async (req, res) => {
  try {
    const graphicsCards = await modelGraphicsCard.find({ status: { $ne: 'disable' } });
    const total = await modelGraphicsCard.countDocuments({ status: { $ne: 'disable' } });
    if (graphicsCards.length === 0) {
      return res.status(STATUS_NOT_FOUND).json(createErrorResponse('Không tìm thấy card đồ họa nào', STATUS_NOT_FOUND));
    }
    return res.status(STATUS_OK).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: STATUS_OK,
      total,
      graphicsCards,
    });
  } catch (error) {
    return res.status(STATUS_INTERNAL_ERROR).json(createErrorResponse('Lỗi khi truy xuất dữ liệu', STATUS_INTERNAL_ERROR));
  }
};

module.exports = { getAllGraphicsCard };
