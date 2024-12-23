const AuctionModel = require("../../../model/autions/autions.model.js");
const BiddingModel = require("../../../model/autions/biddingList.model.js");
const { sendEmail } = require("../../../utils/emailService.js");

const AuctionController = {
  // Kiểm tra và xử lý trạng thái thanh toán của người thắng
  checkPaymentStatus: async (req, res) => {
    try {
      const { auctionId } = req.params;
  
      // Lấy thông tin phiên đấu giá
      const auction = await AuctionModel.findById(auctionId);
      if (!auction) {
        return res.status(404).json({ message: "Không tìm thấy phiên đấu giá." });
      }
  
      const now = new Date();
      if (auction.paymentStatus === 'paid') {
        return res.status(200).json({ message: "Thanh toán đã hoàn tất." });
      }
  
      if (now > auction.paymentDeadline && auction.paymentStatus === 'pending') {
        const lastWinner = auction.winnerId;
  
        // Tìm người đặt giá kế tiếp
        const nextBid = await BiddingModel.findOne({ auctionPricingRangeId: auctionId, status: 'active' })
          .sort({ bidPrice: -1 })
          .skip(1);
  
        if (nextBid) {
          // Cập nhật thông tin người thắng mới
          auction.winnerId = nextBid.userId;
          auction.paymentDeadline = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
          await auction.save();
  
          // Gửi email thông báo cho người kế tiếp
          const nextUserEmail = nextBid.userId.email; // Giả sử có trường email trong User
          await sendEmail(
            nextUserEmail,
            "Chúc mừng! Bạn là người thắng cuộc tiếp theo",
            `<p>Chào bạn,</p>
             <p>Bạn đã được chọn là người thắng cuộc kế tiếp trong phiên đấu giá "${auction.productId}".</p>
             <p>Vui lòng thanh toán trước thời hạn: ${auction.paymentDeadline.toLocaleString()}.</p>
             <p>Trân trọng,<br>Auction System</p>`
          );
  
          return res.status(200).json({ message: "Quyền thắng đã chuyển cho người kế tiếp.", nextWinner: nextBid.userId });
        } else {
          // Hủy phiên đấu giá nếu không còn ai
          auction.status = 'failed';
          await auction.save();
  
          return res.status(200).json({ message: "Không có người thắng, phiên đấu giá đã bị hủy." });
        }
      }
  
      return res.status(400).json({ message: "Chưa đến thời gian thanh toán hoặc đã thanh toán." });
    } catch (error) {
      console.error("Error checking payment status:", error);
      return res.status(500).json({ message: "Lỗi hệ thống." });
    }
  },

  // Xác nhận thanh toán và kết thúc phiên đấu giá
  confirmPayment: async (req, res) => {
    try {
      const { auctionId } = req.params;
  
      // Lấy thông tin phiên đấu giá
      const auction = await AuctionModel.findById(auctionId);
      if (!auction) {
        return res.status(404).json({ message: "Không tìm thấy phiên đấu giá." });
      }
  
      if (auction.paymentStatus === 'paid') {
        return res.status(400).json({ message: "Thanh toán đã hoàn tất." });
      }
  
      // Cập nhật trạng thái thanh toán
      auction.paymentStatus = 'paid';
      auction.status = 'completed';
      await auction.save();
  
      // Gửi email xác nhận cho người thắng
      const winnerEmail = auction.winnerId.email; // Giả sử có trường email trong User
      await sendEmail(
        winnerEmail,
        "Xác nhận thanh toán thành công",
        `<p>Chúc mừng bạn,</p>
         <p>Bạn đã hoàn tất thanh toán cho sản phẩm "${auction.productId}".</p>
         <p>Sản phẩm sẽ sớm được giao đến bạn. Cảm ơn đã tham gia đấu giá!</p>
         <p>Trân trọng,<br>Auction System</p>`
      );
  
      return res.status(200).json({ message: "Thanh toán thành công, phiên đấu giá kết thúc." });
    } catch (error) {
      console.error("Error confirming payment:", error);
      return res.status(500).json({ message: "Lỗi hệ thống." });
    }
  },

  // Hủy quyền thắng của người hiện tại và chuyển quyền
  cancelWinner: async (req, res) => {
    try {
      const { auctionId } = req.params;

      // Lấy thông tin phiên đấu giá
      const auction = await AuctionModel.findById(auctionId);
      if (!auction) {
        return res.status(404).json({ message: "Không tìm thấy phiên đấu giá." });
      }

      // Kiểm tra trạng thái
      if (auction.paymentStatus === 'paid') {
        return res.status(400).json({ message: "Phiên đấu giá đã hoàn tất, không thể hủy." });
      }

      const lastWinner = auction.winnerId;

      // Tìm người đặt giá kế tiếp
      const nextBid = await BiddingModel.findOne({ 
        auctionPricingRangeId: auctionId, 
        status: 'active' 
      })
        .sort({ bidPrice: -1 })
        .skip(1); // Skip người hiện tại

      if (nextBid) {
        // Cập nhật người thắng mới
        auction.winnerId = nextBid.userId;
        auction.paymentDeadline = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // Gia hạn 2 ngày cho người mới
        await auction.save();

        // Cập nhật trạng thái của bid cũ và bid mới
        if (lastWinner) {
          await BiddingModel.updateOne({ userId: lastWinner, auctionPricingRangeId: auctionId }, { status: 'expired' });
        }
        await BiddingModel.updateOne({ userId: nextBid.userId, auctionPricingRangeId: auctionId }, { status: 'active' });

        return res.status(200).json({ message: "Đã hủy quyền thắng, quyền được chuyển cho người kế tiếp.", nextWinner: nextBid.userId });
      } else {
        // Nếu không có người kế tiếp, hủy phiên đấu giá
        auction.status = 'failed';
        await auction.save();
        return res.status(200).json({ message: "Không có người thắng, phiên đấu giá đã bị hủy." });
      }
    } catch (error) {
      console.error("Error canceling winner:", error);
      return res.status(500).json({ message: "Lỗi hệ thống." });
    }
  }
};

module.exports = AuctionController;
