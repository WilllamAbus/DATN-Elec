const ProductAuctionService = require('./getAuctionProductSV');
const resetFilter = async (req, res) => {
  const defaultFilters = {
    page: 1,
    _sort: 'product_price:ASC',
    brand: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  };

  try {
    const response = await ProductAuctionService.getAuctionProducts(
      defaultFilters.page,
      6, 
      defaultFilters._sort,
      defaultFilters.brand,
      defaultFilters.minPrice,
      defaultFilters.maxPrice
    );

    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi',
        status: 400
      });
    }

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      data: response.response,
      pagination: {
        currentPage: defaultFilters.page,
        totalPages: Math.ceil(response.response.total / 6),
        hasNextPage: false,
        hasPrevPage: false,
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
module.exports = { resetFilter };