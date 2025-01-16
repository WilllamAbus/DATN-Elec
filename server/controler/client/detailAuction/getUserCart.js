const Cart = require("../../../model/orders/cart.model");
const User = require("../../../model/users.model");

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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng.",
        success: false,
        code: 404
      });
    }

    const currentTime = new Date();

    // Kiểm tra và reset statusWarningTimeout nếu thời gian phạt đã hết
    if (user.statusWarningTimeout && currentTime >= new Date(user.timeLimit)) {
      user.statusWarningTimeout = false;
      user.timeLimit = null;
      await user.save();
    }

    const userCart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price')
      .populate('items.productVariant', 'variantName')
      .populate('items.inventory', 'stock quantity')
      .populate('itemAuction.auctionWinner', 'user bidPrice paymentStatus')
      .populate('itemAuction.inventory', 'stock')
      .populate('itemAuction.auctionPricingRange', 'startTime endTime startingPrice maxPrice currentPrice priceStep status product_randBib isPriceStepAdjusted')
      .populate('itemAuction.auctionRound', 'auctionPricing participants bids status');

    let statusCart = 0;
    if (userCart && userCart.itemAuction && userCart.itemAuction.length > 0) {
      statusCart = 1;
    } else if (userCart && userCart.items && userCart.items.length > 0) {
      statusCart = 2;
    }

    return res.status(200).json({
      message: "Lấy giỏ hàng thành công.",
      success: true,
      code: 200,
      statusCart: statusCart,
      cart: userCart,
      statusWarningTimeout: user.statusWarningTimeout,
      timeLimit: user.timeLimit,
      isBanned: user.isBanned,
      statusAuction: user.statusAuction,
      message: user.message,
      warning: user.warning,
      noteWarning: user.noteWarning
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
