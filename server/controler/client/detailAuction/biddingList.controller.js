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


const processAuctionWinner = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await BiddingService.processAuctionWinner(slug);

    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: -1,
      msg: "Lỗi server: " + error.message,
    });
  }
  
};

const getUserBiddingHistory = async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Lấy page và limit từ query
  const userId = req.user ? req.user.id : null; 


  if (!userId) {
    return res.status(401).json({
      success: false,
      err: 1,
      msg: "Người dùng chưa đăng nhập.",
      status: 401,
    });
  }

  try {
    const response = await BiddingService.getUserBiddingHistoryService(userId, +page, +limit);

    if (response.err) {
      return res.status(response.status).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi khi lấy lịch sử đấu giá.',
        status: response.status,
      });
    }

    return res.status(response.status).json({
      success: true,
      err: 0,
      msg: response.msg || 'Lấy lịch sử đấu giá thành công.',
      status: response.status,
      data: response.response,
    });
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      err: -1,
      msg: "Lỗi server: " + error.message,
      status: 500,
    });
  }
};

const getUserBiddingDetails = async (req, res) => {
  const { slug } = req.params; // Lấy slug sản phẩm từ URL
  const userId = req.user ? req.user.id : null; 


  if (!userId) {
    return res.status(401).json({
      success: false,
      err: 1,
      msg: "Người dùng chưa đăng nhập.",
      status: 401,
    });
  }

  if (!slug) {
    return res.status(400).json({
      success: false,
      err: 1,
      msg: "Slug sản phẩm là bắt buộc.",
      status: 400,
    });
  }

  try {
    const response = await BiddingService.getUserBiddingDetailsService(userId, slug);

    if (response.err) {
      return res.status(response.status).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi khi lấy chi tiết lịch sử đấu giá.',
        status: response.status,
      });
    }

    return res.status(response.status).json({
      success: true,
      err: 0,
      msg: response.msg || 'Lấy chi tiết lịch sử đấu giá thành công.',
      status: response.status,
      data: response.response,
    });
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      err: -1,
      msg: "Lỗi server: " + error.message,
      status: 500,
    });
  }
};




module.exports = {
  getBiddingList,
  processAuctionWinner,
  getUserBiddingHistory,
  getUserBiddingDetails
};
