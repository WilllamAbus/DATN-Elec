const BiddingService = require('../../../services/detailAuction/getBiddingListSV');
const { getIO } = require('../../../services/skserver/socketServer');

const getBiddingList = async (req, res) => {
  const { slug } = req.params; // Lấy slug từ URL
  const { page = 1, limit = 5 } = req.query; // Lấy page và limit từ query
  const io = getIO(); // WebSocket instance

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

    // Phát thông báo thời gian thực qua WebSocket
    io.emit('updateBiddingList', {
      slug,
      biddingList: response.response.biddingList,
      pagination: response.response.pagination,
    });

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
  const io = getIO(); // WebSocket instance

  try {
    const { slug } = req.params;

    const result = await BiddingService.processAuctionWinner(slug);

    // Nếu có lỗi hoặc không tìm thấy người thắng
    if (!result.success) {
      return res.status(result.status).json(result);
    }

    // Phát thông báo người chiến thắng qua WebSocket
    io.emit('auctionWinnerDeclared', {
      message: `Người chiến thắng cho phiên đấu giá ${slug} đã được xác định.`,
      winner: result.winner, // Thông tin người thắng
      bidPrice: result.bidPrice, // Giá thắng
      slug,
      status: 'ended', // Trạng thái phiên đấu giá
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error processing auction winner:", error);

    return res.status(500).json({
      success: false,
      err: -1,
      msg: "Lỗi server: " + error.message,
    });
  }
};



const getUserBiddingHistory = async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Lấy page và limit từ query
  const userId = req.user ? req.user.id : null; // Lấy userId từ req.user

  if (!userId) {
    return res.status(401).json({
      success: false,
      err: 1,
      msg: "Người dùng chưa đăng nhập.",
      status: 401,
    });
  }

  try {
    // Gọi service lấy danh sách sản phẩm đã tham gia đấu giá
    const response = await BiddingService.getUserParticipatedProductsService(userId);

    if (!response.success) {
      return res.status(response.status).json({
        success: false,
        err: response.err,
        msg: response.msg || "Không thể lấy danh sách sản phẩm người dùng đã tham gia đấu giá.",
        status: response.status,
      });
    }

    // Phân trang từ dữ liệu trả về
    const totalItems = response.response.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = response.response.slice(startIndex, startIndex + limit);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: "Lấy danh sách sản phẩm tham gia đấu giá thành công.",
      status: 200,
      data: {
        products: paginatedData,
        pagination: {
          totalItems,
          totalPages,
          currentPage: +page,
          limit: +limit,
          hasNextPage: +page < totalPages,
          hasPrevPage: +page > 1,
        },
      },
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
  const { slug } = req.params; // Lấy slug từ params
  const userId = req.user ? req.user.id : null; // Lấy userId từ req.user

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
    // Gọi service lấy chi tiết lịch sử đấu giá
    const response = await BiddingService.getUserProductBiddingDetailsService(userId, slug);

    if (!response.success) {
      return res.status(response.status).json({
        success: false,
        err: response.err,
        msg: response.msg || "Không thể lấy chi tiết lịch sử đấu giá của sản phẩm.",
        status: response.status,
      });
    }

    return res.status(200).json({
      success: true,
      err: 0,
      msg: "Lấy chi tiết lịch sử đấu giá thành công.",
      status: 200,
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
