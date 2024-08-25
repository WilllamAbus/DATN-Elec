const { Schema, model } = require("mongoose");

const biddingSchema = Schema(
  {
    biddser: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Người dùng thực hiện đấu giá
    bidAmount: { type: Number, required: true }, // Số tiền đấu giá
    bidTime: { type: Date, default: Date.now }, // Thời gian thực hiện đấu giá
    isWinningBid: { type: Boolean, default: false }, // Đánh dấu lượt đấu giá là thắng cuộc hay không

    isActive: { type: Boolean, default: true },
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "bidding",
    timestamps: true,
  }
);

module.exports = model("bidding", biddingSchema);