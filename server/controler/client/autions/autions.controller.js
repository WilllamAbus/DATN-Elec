const AuctionModel = require("../../../model/autions/autions.model.js");
const BiddingModel = require("../../../model/autions/biddingList.model.js");

const AuctionController = {
  // Kiểm tra thanh toán của người thắng
  checkPaymentStatus: async (req, res) => {
    try {
      const { auctionId } = req.params;

      // Lấy thông tin phiên đấu giá
      const auction = await AuctionModel.findById(auctionId);
      if (!auction) {
        return res.status(400).json({ message: "Không tìm thấy phiên đấu giá." });
      }

      // Kiểm tra xem người thắng đã thanh toán chưa
      if (auction.paymentStatus === 'paid') {
        return res.status(200).json({ message: "Thanh toán đã hoàn tất." });
      }

      // Nếu hết thời gian thanh toán mà chưa thanh toán, chuyển quyền thắng cho người kế tiếp
      const lastWinner = auction.winnerId;
      const paymentDeadline = auction.paymentDeadline;
      const now = new Date();

      if (now > paymentDeadline && auction.paymentStatus === 'pending') {
        // Chuyển quyền thắng cho người tiếp theo trong danh sách BiddingList
        const nextBid = await BiddingModel.findOne({ auctionPricingRangeId: auctionId, status: 'active' })
          .sort({ bidPrice: -1 })
          .skip(1); // Skip the current winner

        if (nextBid) {
          // Cập nhật người thắng mới
          auction.winnerId = nextBid.userId;
          auction.paymentStatus = 'pending'; // Đặt lại trạng thái thanh toán cho người thắng mới
          await auction.save();

          // Cập nhật trạng thái của bid cũ và bid mới
          await BiddingModel.updateOne({ userId: lastWinner, auctionPricingRangeId: auctionId }, { status: 'expired' });
          await BiddingModel.updateOne({ userId: nextBid.userId, auctionPricingRangeId: auctionId }, { status: 'active' });

          return res.status(200).json({ message: "Quyền thắng đã chuyển cho người kế tiếp." });
        } else {
          // Nếu không có ai tiếp theo, hủy phiên đấu giá
          auction.status = 'failed';
          await auction.save();
          return res.status(200).json({ message: "Không có người thắng, phiên đấu giá đã bị hủy." });
        }
      }

      return res.status(400).json({ message: "Chưa đến thời gian thanh toán hoặc đã thanh toán." });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
  },

  // Xác nhận thanh toán và kết thúc phiên đấu giá
  confirmPayment: async (req, res) => {
    try {
      const { auctionId } = req.params;

      // Lấy thông tin phiên đấu giá
      const auction = await AuctionModel.findById(auctionId);
      if (!auction) {
        return res.status(400).json({ message: "Không tìm thấy phiên đấu giá." });
      }

      // Kiểm tra xem phiên đấu giá có phải là phiên thắng chưa thanh toán không
      if (auction.paymentStatus === 'paid') {
        return res.status(400).json({ message: "Thanh toán đã hoàn tất." });
      }

      // Cập nhật trạng thái thanh toán là "paid"
      auction.paymentStatus = 'paid';
      auction.status = 'completed'; // Đánh dấu phiên đấu giá là hoàn tất
      await auction.save();

      return res.status(200).json({ message: "Thanh toán thành công, phiên đấu giá kết thúc." });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
  }
};

module.exports = AuctionController;
