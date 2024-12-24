const BiddingService = require('../../../services/detailAuction/getBiddingListSV');

const getBiddingList = async (req, res) => {
  const { slug } = req.params; // Lấy slug từ URL
  const { page = 1, limit = 5 } = req.query; // Lấy page và limit từ query, có giá trị mặc định

  try {
    const response = await BiddingService.getBiddingListService(slug, +page, +limit);

    if (response.err) {
      return res.status(response.status).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi khi lấy danh sách đấu giá.',
        status: response.status,
      });
    }

    return res.status(response.status).json({
      success: true,
      err: 0,
      msg: response.msg || 'OK',
      status: response.status,
      data: response.response,
    });
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      err: -1,
      msg: "Lỗi: " + error.message,
      status: 500,
    });
  }
};

module.exports = {
  getBiddingList,
};
