const { Schema, model } = require("mongoose");
const biddingSchema = require("./bidding.model");
const auctionSchema = Schema(
  {
    auction_winner: { type: String, require: true },
    auction_total: { type: Number, require: true },
    
    // Khoảnh giá của phiên đấu giá
    auctionStartTime: { type: Date, required: true }, // Thời gian bắt đầu đấu giá
    auctionEndTime: { type: Date, required: true }, // Thời gian kết thúc đấu giá
    isAuctionActive: { type: Boolean, default: true }, // Đánh dấu phiên đấu giá có đang hoạt động hay không
    biddings: [biddingSchema], // Mảng các lượt đấu giá
    // Thời gian cập nhật phiên đấu giá
    modifieon: { type: Date, default: Date.now },
    stateNotifi: { type: String, default: "has" },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "auctions",
    timestamps: true,
  }
);

module.exports = model("auctions", auctionSchema);
