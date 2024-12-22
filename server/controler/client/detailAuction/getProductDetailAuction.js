const ProductAuction = require('../../../model/productAuction/productAuction');

const ProductDetailService = require('../../../services/detailAuction/productDetailAuction.service');

const getProductDetailAuction = async (req, res) => {
  const { slug } = req.params; 
    const userId = req.user ? req.user.id : null; 
  
  try {
    const productAuction = await ProductAuction.findOne({ slug });
    if (!productAuction) {
      return res.status(200).json({
        success: true,
        auctionPricing: [],  
      });
    }

    const response = await ProductDetailService.getProductDetailAuction(slug,userId);

    if (!response.success) {
      return res.status(response.status).json({
        success: response.success,
        err: response.err,
        msg: response.msg,
        status: response.status,
      });
    }
 
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      data: response.data,
    });

  } catch (error) {
    console.error('Error in getProductDetail:', error);
    return res.status(500).json({
      success: false,
      err: -1,
      msg: 'Error: ' + error.message,
      status: 500,
    });
  }
};

module.exports = {
  getProductDetailAuction
};
