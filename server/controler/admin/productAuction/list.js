const ProductAuctionService = require('./getListAuctionSV');

const getListAuction = async (req, res) => {
  const { page, search } = req.query; 


  try {
    const response = await ProductAuctionService.getListProductAuctionService(page, search);
    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi khi lấy sản phẩm',
        status: 400
      });
    }

    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(response.response.total / (+process.env.LIMIT || 1));

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      data: response.response, 
      pagination: {
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      }
    });

  } catch (error) {
    console.error('Error:', error);

    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'lỗi: ' + error.message,
      status: 500
    });
  }
};

module.exports = {
  getListAuction,
};
