const ProductAuction = require('../../../../model/productAuction/productAuction');

module.exports = async (slug) => {
  const productAuction = await ProductAuction.findOne({ slug }).populate('auctionPricing');
  if (!productAuction) {
    return {
      success: false,
      err: 1,
      msg: 'Sản phẩm đấu giá không tồn tại',
      status: 'error',
    };
  }
  return productAuction;
};
