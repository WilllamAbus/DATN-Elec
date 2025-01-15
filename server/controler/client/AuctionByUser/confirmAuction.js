const AuctionWinner = require('../../../model/productAuction/auctionWinner');
const Cart = require('../../../model/orders/cart.model');
const AuctionPricingRange = require('../../../model/productAuction/auctionPricingRange');
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

    let auctionStartTime, auctionEndTime, remainingTimeString;
    const currentTime = new Date();

    if (auctionWinner.status === 'active') {
      auctionEndTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 giờ từ bây giờ
    } else if (auctionWinner.status === 'temporary') {
      auctionEndTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // 30 phút từ bây giờ
    } else {
      return res.status(400).json({
        code: 'TRANG_THAI_KHONG_HOP_LE',
        msg: 'Trạng thái không hợp lệ.',
        status: 'error',
        error: 'Invalid status'
      });
    }

    auctionStartTime = currentTime;
    
    // Tính thời gian còn lại
    const remainingTime = auctionEndTime.getTime() - currentTime.getTime();
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    remainingTimeString = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;

    const itemAuction = {
      auctionWinner: auctionWinner._id,
      auctionStartTime: auctionStartTime, 
      auctionEndTime: auctionEndTime,
      remainingTime: remainingTimeString,
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
          remainingTime: itemAuction.remainingTime,
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
