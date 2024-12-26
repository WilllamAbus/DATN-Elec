const AuctionWinner = require('../../../model/productAuction/auctionWinner');
const Cart = require('../../../model/orders/cart.model');
const mongoose = require('mongoose');

const confirmAuction = async (req, res) => {
  try {
    const { auctionWinnerId } = req.body; 
    const auctionWinner = await AuctionWinner.findById(auctionWinnerId).populate('auctionPricingRange auctionRound user');

    if (!auctionWinner) {
      return res.status(404).json({ code: 'KHONG_TIM_THAY_DAU_GIA', msg: 'Không tìm thấy kết quả đấu giá.' });
    }

    if (auctionWinner.confirmationStatus === 'confirmed') {
      return res.status(400).json({ code: 'DA_XAC_NHAN', msg: 'Kết quả đấu giá đã được xác nhận trước đó.' });
    }

    auctionWinner.confirmationStatus = 'confirmed';
    await auctionWinner.save();

    const auctionEndTime = new Date(auctionWinner.startTime);
    auctionEndTime.setDate(auctionEndTime.getDate() + 3);

    const cartItem = {
      auctionWiner: auctionWinner._id,
      auctionStartTime: auctionWinner.startTime,
      auctionEndTime: auctionEndTime,
      price: auctionWinner.bidPrice,
      totalItemPrice: auctionWinner.bidPrice,
      auctionPricingRange: auctionWinner.auctionPricingRange._id,
      auctionRound: auctionWinner.auctionRound._id,
    };

    const userCart = await Cart.findOne({ user: auctionWinner.user });
    if (userCart) {
      userCart.itemAuction.push(cartItem);
      userCart.totalPrice += auctionWinner.bidPrice;
      await userCart.save();
    } else {
      const newCart = new Cart({
        user: auctionWinner.user,
        itemAuction: [cartItem],
        totalPrice: auctionWinner.bidPrice,
      });
      await newCart.save();
    }

    return res.status(200).json({ code: 'THANH_CONG', msg: 'Kết quả đấu giá đã được xác nhận và thêm vào giỏ hàng.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 'LOI_MAY_CHU', msg: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

module.exports = {
  confirmAuction,
};
