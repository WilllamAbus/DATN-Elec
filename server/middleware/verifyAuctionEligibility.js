const Cart = require("../model/orders/cart.model");

const verifyAuctionEligibility = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userCart = await Cart.findOne({ user: userId });

    if (userCart) {
      if (userCart.itemAuction && userCart.itemAuction.length > 0) {
        return res.status(403).json({
          message: "Bạn có sản phẩm trong giỏ hàng. Vui lòng hoàn tất thanh toán trước khi tiếp tục đấu giá.",
          success: false,
          code: 403
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi máy chủ khi kiểm tra tính đủ điều kiện đấu giá.",
      success: false,
      code: 500,
      error: error.message
    });
  }
};

module.exports = { verifyAuctionEligibility };
