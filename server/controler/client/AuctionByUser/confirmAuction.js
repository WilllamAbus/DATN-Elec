const AuctionWinner = require('../../../model/productAuction/auctionWinner');
const Cart = require('../../../model/orders/cart.model');
const mongoose = require('mongoose');

const confirmAuction = async (req, res) => {
  try {
    const { auctionWinnerId } = req.body;
    const auctionWinner = await AuctionWinner.findById(auctionWinnerId)
      .populate('auctionPricingRange auctionRound user');

    if (!auctionWinner) {
      return res.status(404).json({
        code: 'KHONG_TIM_THAY_DAU_GIA',
        msg: 'Không tìm thấy kết quả đấu giá.',
        status: 'error',
        error: 'Auction winner not found'
      });
    }

    if (auctionWinner.confirmationStatus === 'confirmed') {
      return res.status(400).json({
        code: 'DA_XAC_NHAN',
        msg: 'Kết quả đấu giá đã được xác nhận trước đó.',
        status: 'error',
        error: 'Auction winner already confirmed'
      });
    }

    auctionWinner.confirmationStatus = 'confirmed';
    await auctionWinner.save();

    const auctionEndTime = new Date(auctionWinner.startTime);
    auctionEndTime.setDate(auctionEndTime.getDate() + 3);

    const itemAuction = {
      auctionWinner: auctionWinner._id,
      auctionStartTime: auctionWinner.startTime,
      auctionEndTime: auctionEndTime,
      price: auctionWinner.bidPrice,
      totalItemPrice: auctionWinner.bidPrice,
      auctionPricingRange: auctionWinner.auctionPricingRange._id,
      auctionRound: auctionWinner.auctionRound._id,
      isSelected: false,
      quantity: 1,
    };

    const userCart = await Cart.findOne({ user: auctionWinner.user })
      .populate('itemAuction.auctionWinner');
    if (userCart) {
      userCart.itemAuction.push(itemAuction);
      userCart.totalPrice += auctionWinner.bidPrice;
      await userCart.save();
    } else {
      const newCart = new Cart({
        user: auctionWinner.user,
        itemAuction: [itemAuction],
        totalPrice: auctionWinner.bidPrice,
      });
      await newCart.save();
    }

    return res.status(200).json({
      code: 'THANH_CONG',
      msg: 'Kết quả đấu giá đã được xác nhận và thêm vào giỏ hàng.',
      status: 'success',
      error: null,
      data: {
        auctionWinner: {
          id: auctionWinner._id,
          user: auctionWinner.user,
          auctionPricingRange: auctionWinner.auctionPricingRange,
          auctionRound: auctionWinner.auctionRound,
          bidPrice: auctionWinner.bidPrice,
          confirmationStatus: auctionWinner.confirmationStatus,
        },
        itemAuction: {
          auctionWinner: auctionWinner,
          auctionStartTime: itemAuction.auctionStartTime,
          auctionEndTime: itemAuction.auctionEndTime,
          price: itemAuction.price,
          totalItemPrice: itemAuction.totalItemPrice,
          auctionPricingRange: itemAuction.auctionPricingRange,
          auctionRound: itemAuction.auctionRound,
          isSelected: itemAuction.isSelected,
          quantity: itemAuction.quantity,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 'LOI_MAY_CHU',
      msg: 'Lỗi máy chủ. Vui lòng thử lại sau.',
      status: 'error',
      error: error.message
    });
  }
};

module.exports = {
  confirmAuction,
};
