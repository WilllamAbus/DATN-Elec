const ProductAuctionService = require('../../../services/product/admin/product-auction/getDeleteListAuction.Service');

const getDeleteListAuction = async (req, res) => {
  const { page = 1, search } = req.query;
  const limit = 5;

  try {
    const response = await ProductAuctionService.getDeleteListProductAuctionService(page, limit, search);
    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Error deleting product list',
        status: 400,
      });
    }

    const currentPage = +page;
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
      },
    });
  } catch (error) {
    console.error('Error:', error);

    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Error: ' + error.message,
      status: 500,
    });
  }
};

module.exports = {
  getDeleteListAuction,
};
