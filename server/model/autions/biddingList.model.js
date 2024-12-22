const { Schema, model } = require("mongoose");

const biddingListSchema = new Schema(
  {
    auctionPricingRangeId: { type: Schema.Types.ObjectId, ref: 'AuctionPricingRange', required: true },  // Liên kết với phiên đấu giá
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Người tham gia
    bidPrice: { type: Number, required: true },  // Giá mà người tham gia đã đặt
    bidTime: { type: Date, default: Date.now },  // Thời gian đặt giá
    status: { type: String, enum: ['active', 'expired'], default: 'active' },  // Trạng thái của bid (còn hiệu lực hay đã hết hạn)
    paymentStatus: { type: String, enum: ['pending', 'paid', 'payment_failed'], default: 'pending' },  // Trạng thái thanh toán của người thắng
  },
  {
    collection: "BiddingList",
    timestamps: true,
  }
);

module.exports = model("BiddingList", biddingListSchema);
