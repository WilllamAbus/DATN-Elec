const ProductAuctionService = require('./getAuctionProductSV');
const listPageAuction = async (req, res) => {
  const { page, _sort, brand, conditionShopping, minPrice, maxPrice, minDiscountPercent, maxDiscountPercent } = req.query;
  const limit = 12;
  const brands = brand ? brand.split(',').map(b => b.trim()).filter(b => b) : [];
  const conditions = conditionShopping ? conditionShopping.split(',').map(c => c.trim()).filter(c => c) : [];
  
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000)); 
    const response = await ProductAuctionService.getAuctionProducts(
      page, 
      limit, 
      _sort, 
      brands,  
      conditions, 
      minPrice, 
      maxPrice, 
      minDiscountPercent, 
      maxDiscountPercent
    );

    if (response.err) {
      return res.status(400).json({
        success: false,
        err: response.err,
        msg: response.msg || 'Lỗi',
        status: 400
      });
    }

    const products = response.response.products.filter(product => 
      product.status === 'active' && 
      ['active', 'ended','temporary'].includes(product.auctionPricing.status)
    );

    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(products.length / limit);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      data: {
        total: products.length,
        products
      },
      pagination: {
        currentPage,
        totalPages,
        limit,
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
