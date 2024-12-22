const BiddingModel = require("../../../model/autions/biddingList.model.js");
const AuctionModel = require("../../../model/autions/autions.model.js");

const BiddingListController = {
  // Đặt giá - Khi người dùng nhấn nút "Đặt giá"
  placeBid: async (req, res) => {
    try {
      const { auctionPricingRangeId, bidPrice } = req.body;
      const userId = req.user.id;

      // Kiểm tra xem người dùng có đang tham gia phiên đấu giá không
      const auction = await AuctionModel.findById(auctionPricingRangeId);
      if (!auction || auction.status !== 'active') {
        return res.status(400).json({ message: "Phiên đấu giá không hợp lệ hoặc đã kết thúc." });
      }

      // Kiểm tra giá đặt có hợp lệ không (lớn hơn hoặc bằng giá hiện tại + bước giá)
      const currentPrice = auction.currentPrice;
      const priceStep = auction.priceStep;
      if (bidPrice < currentPrice + priceStep) {
        return res.status(400).json({ message: `Giá phải lớn hơn hoặc bằng ${currentPrice + priceStep} VND` });
      }

      // Kiểm tra nếu giá nhập vào phải là số hàng ngàn (không phải số lẻ)
      if (bidPrice % 1000 !== 0) {
        return res.status(400).json({ message: "Giá phải là số hàng ngàn (không phải số lẻ)." });
      }

      // Lưu thông tin đặt giá vào bảng BiddingList
      const newBid = new BiddingModel({
        auctionPricingRangeId,
        userId,
        bidPrice,
        bidTime: Date.now(),
        status: 'active'
      });

      await newBid.save();

      // Cập nhật lại giá hiện tại của phiên đấu giá
      auction.currentPrice = bidPrice;
      await auction.save();

      return res.status(200).json({ message: "Đặt giá thành công!", bid: newBid });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
  }
};

module.exports = BiddingListController;
