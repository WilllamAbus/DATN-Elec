const AuctionProgress = require('../../../services/detailAuction/auctionProgressService');
const { getIO } = require('../../../services/skserver/socketServer');

const getAuctionProgress = async (req, res) => {
  const { slug } = req.params;
  const { page, limit = 4 } = req.query;

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const response = await AuctionProgress.getAuctionProgressService(slug, page ? +page : undefined, +limit);
    if (!response.success) {
      return res.status(response.status || 500).json({
        success: false,
        err: response.err || -1,
        msg: response.msg || "Lỗi khi lấy danh sách đấu giá.",
        status: response.status || 500,
        timestamp: new Date().toISOString(),
        errorCode: response.err || -1,
      });
    }

    getIO().emit('auctionProgressUpdated', {
      ...response.response,
      status: response.status,
      timestamp: new Date().toISOString(),
    });

    return res.status(response.status || 200).json({
      success: true,
      err: 0,
      msg: response.msg || "Lấy danh sách đấu giá thành công.",
      status: response.status || 200,
      timestamp: new Date().toISOString(),
      statusCode: 6,
      data: response.response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: -1,
      msg: "Đã xảy ra lỗi trong quá trình xử lý: " + error.message,
      status: 500,
      timestamp: new Date().toISOString(),
      errorCode: -1,
    });
  }
};

module.exports = { getAuctionProgress };
