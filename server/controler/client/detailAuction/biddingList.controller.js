const BiddingService = require('../../../services/detailAuction/getBiddingListSV');


const getBiddingListAndWinner = async (req, res) => {
  const { slug } = req.params; // Lấy slug từ URL
  const { page = 1, limit = 5 } = req.query; // Lấy page và limit từ query

  try {
    // Gọi hàm service xử lý logic
    const response = await BiddingService.getBiddingListAndWinnerService(slug, +page, +limit);

    // Nếu không tìm thấy hoặc có lỗi từ service
    if (!response.success) {
      console.error("Service Error:", response.msg);
      return res.status(response.status || 500).json({
        success: false,
        err: response.err || -1,
        msg: response.msg || "Lỗi khi lấy danh sách đấu giá.",
        status: response.status || 500,
      });
    }

    // Trả về kết quả thành công
    return res.status(response.status || 200).json({
      success: true,
      err: 0,
      msg: response.msg || "Lấy danh sách đấu giá thành công.",
      status: response.status || 200,
      data: response.response,
    });
  } catch (error) {
    console.error("Controller Error:", error);

    // Xử lý lỗi chung
    return res.status(500).json({
      success: false,
      err: -1,
      msg: "Đã xảy ra lỗi trong quá trình xử lý: " + error.message,
      status: 500,
    });
  }
};










const getUserBiddingHistory = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
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
    // Gọi service để lấy danh sách sản phẩm đã tham gia đấu giá
    const response = await BiddingService.getUserParticipatedProductsService(userId);

    if (!response.success) {
      return res.status(response.status).json({
        success: false,
        err: response.err,
        msg: response.msg || "Không thể lấy danh sách sản phẩm người dùng đã tham gia đấu giá.",
        status: response.status,
      });
    }

    // Phân trang dữ liệu
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
    console.error("Error in getUserBiddingHistory:", error);
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
  getBiddingListAndWinner,
  getUserBiddingHistory,
  getUserBiddingDetails
};
