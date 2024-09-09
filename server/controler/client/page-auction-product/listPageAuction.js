const ProductAuctionService = require('./getAuctionProductSV');

const listPageAuction = async (req, res) => {
  const { page, _sort } = req.query; 
  const limit = 6; 

  try {
    const response = await ProductAuctionService.getAuctionProducts(page, limit, _sort);

    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi',
        status: 400
      });
    }

    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(response.response.total / limit);

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
    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Error: ' + error.message,
      status: 500
    });
  }
};



module.exports = { listPageAuction };
