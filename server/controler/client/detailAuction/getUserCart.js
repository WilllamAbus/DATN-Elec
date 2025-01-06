const Cart = require("../../../model/orders/cart.model");

const getUserCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập.",
        success: false,
        code: 401
      });
    }

    const userId = req.user.id;
    const userCart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price') 
      .populate('items.productVariant', 'variantName') 
      .populate('items.inventory', 'stock quantity')
      .populate('itemAuction.auctionWinner', 'user bidPrice paymentStatus')
      .populate('itemAuction.inventory', 'stock') 
      .populate('itemAuction.auctionPricingRange', 'startTime endTime startingPrice maxPrice currentPrice priceStep status product_randBib isPriceStepAdjusted') 
      .populate('itemAuction.auctionRound', 'auctionPricing participants bids status'); 

    if (!userCart) {
      return res.status(200).json({
        message: "Giỏ hàng không tồn tại.",
        success: false,
        code: 404,
        statusCart: 0
      });
    }

    let statusCart = 0;
    if (userCart.itemAuction && userCart.itemAuction.length > 0) {
      statusCart = 1;
    } else if (userCart.items && userCart.items.length > 0) {
      statusCart = 2;
    }

    return res.status(200).json({
      message: "Lấy giỏ hàng thành công.",
      success: true,
      code: 200,
      statusCart: statusCart,
      cart: userCart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ khi lấy giỏ hàng.",
      success: false,
      code: 500,
      error: error.message
    });
  }
};

module.exports = { getUserCart };
