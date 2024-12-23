const BiddingModel = require("../../../model/autions/biddingList.model.js");
const AuctionPricingRangeModel = require("../../../model/productAuction/auctionPricingRange.js");

const BiddingListController = {
  // Đặt giá - Khi người dùng nhấn nút "Đặt giá"
  placeBid: async (req, res) => {
    try {
      const { auctionPricingRangeId, bidPrice, buyNow } = req.body; // `buyNow` là cờ để kiểm tra người dùng muốn mua ngay.
      const userId = req.user.id;

      // Kiểm tra xem phiên đấu giá có tồn tại và còn hoạt động không
      const auction = await AuctionPricingRangeModel.findById(auctionPricingRangeId);
      if (!auction || auction.status !== "active") {
        return res.status(400).json({ message: "Phiên đấu giá không hợp lệ hoặc đã kết thúc." });
      }

      const currentPrice = auction.currentPrice;
      const priceStep = auction.priceStep;
      const maxPrice = auction.maxPrice;

      // Kiểm tra nếu người dùng muốn mua ngay
      if (buyNow) {
        if (currentPrice >= maxPrice) {
          return res.status(400).json({ message: "Sản phẩm đã đạt giá tối đa và không thể mua ngay." });
        }

        // Gửi người dùng vào bước thanh toán
        return res.status(200).json({ message: "Chuyển đến thanh toán để mua ngay.", redirect: "/payment-page", price: maxPrice });
      }

      // Kiểm tra giá đặt có hợp lệ không
      if (bidPrice < currentPrice + priceStep) {
        return res.status(400).json({ message: `Giá phải lớn hơn hoặc bằng ${currentPrice + priceStep} VND` });
      }

      // Kiểm tra nếu giá nhập vào phải là số hàng ngàn
      if (bidPrice % 1000 !== 0) {
        return res.status(400).json({ message: "Giá phải là số hàng ngàn (không phải số lẻ)." });
      }

      // Lấy người đặt giá cao nhất hiện tại
      const lastBid = await BiddingModel.findOne({ auctionPricingRangeId })
        .sort({ bidPrice: -1 })
        .exec();

      // Kiểm tra nếu người dùng đã đặt giá gần nhất
      if (lastBid && lastBid.userId.toString() === userId) {
        return res.status(400).json({ message: "Bạn đã đặt giá gần nhất, vui lòng chờ người khác đặt giá trước khi tiếp tục." });
      }

      // Lưu thông tin đặt giá mới vào bảng BiddingList
      const newBid = new BiddingModel({
        auctionPricingRangeId,
        userId,
        bidPrice,
        bidTime: Date.now(),
        status: "active",
      });

      await newBid.save();

      // Cập nhật lại giá hiện tại của phiên đấu giá
      auction.currentPrice = bidPrice;
      await auction.save();

      // Kiểm tra nếu giá nhập bằng giá tối đa
      if (bidPrice >= maxPrice) {
        // Gửi người dùng vào bước thanh toán
        return res.status(200).json({
          message: "Bạn đã đạt giá tối đa. Chuyển đến thanh toán để xác nhận mua.",
          redirect: "/payment-page",
          price: bidPrice,
        });
      }

      return res.status(200).json({ message: "Đặt giá thành công!", bid: newBid });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
  },

  getBiddingList: async (req, res) => {
    try {
      const { auctionPricingRangeId } = req.params;
      console.log("Received auctionPricingRangeId:", auctionPricingRangeId);

      // Kiểm tra xem phiên đấu giá có tồn tại không
      const auction = await AuctionPricingRangeModel.findById(auctionPricingRangeId);
      if (!auction) {
        return res.status(404).json({ message: "Phiên đấu giá không tồn tại." });
      }

      // Lấy danh sách người đặt giá, sắp xếp giảm dần theo giá thầu
      const biddingList = await BiddingModel.find({ auctionPricingRangeId })
        .sort({ bidPrice: -1 }) // Sắp xếp giá thầu từ cao đến thấp
        .populate("userId", "name") // Thay "username email" bằng các trường bạn muốn hiển thị từ User
        .exec();

      if (!biddingList.length) {
        return res.status(200).json({ message: "Chưa có người tham gia đấu giá.", data: [] });
      }

      // Trả về danh sách
      return res.status(200).json({ message: "Danh sách người tham gia đấu giá.", data: biddingList });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
  },

  // Xử lý kết quả thanh toán
  handlePaymentResult: async (req, res) => {
    try {
      const { auctionPricingRangeId, paymentStatus } = req.body;
      const userId = req.user.id;

      const auction = await AuctionPricingRangeModel.findById(auctionPricingRangeId);

      if (!auction) {
        return res.status(404).json({ message: "Phiên đấu giá không tồn tại." });
      }

      if (paymentStatus === "success") {
        // Cập nhật trạng thái đấu giá thành "completed"
        auction.status = "completed";
        await auction.save();

        return res.status(200).json({ message: "Thanh toán thành công. Bạn đã mua sản phẩm này." });
      } else {
        // Khóa tài khoản người dùng
        // (giả sử có hàm `banUserById`)
        await banUserById(userId);

        // Mở lại phiên đấu giá
        auction.status = "active";
        await auction.save();

        return res.status(400).json({
          message: "Thanh toán thất bại. Tài khoản của bạn đã bị khóa và phiên đấu giá được tiếp tục.",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
  },
};

module.exports = BiddingListController;
