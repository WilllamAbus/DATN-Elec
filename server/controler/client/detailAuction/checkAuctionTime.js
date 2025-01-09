const AuctionService = require('../../../services/detailAuction/checkAuctionTimeService');

const checkAuctionTime = async (req, res) => {
  const { slug } = req.params;

  try {
    const response = await AuctionService.checkAuctionTime(slug);

    return res.status(response.status).json({
      success: response.success,
      code: response.code,
      msg: response.msg,
      status: response.status,
      statusOutOfTime:response.statusOutOfTime,
      statuscheckAuctionTime:response.statuscheckAuctionTime
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      msg: 'Lỗi máy chủ. Vui lòng thử lại sau.',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = { checkAuctionTime };
