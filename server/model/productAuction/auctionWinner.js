const { Schema, model } = require("mongoose");

const auctionWinnerSchema = new Schema(
  {
    auctionPricingRange: {
      type: Schema.Types.ObjectId,
      ref: "AuctionPricingRange",
      required: true,
    },
    auctionRound: {
      type: Schema.Types.ObjectId,
      ref: "AuctionRound",
      required: true,
    },
    product_randBib: { type: Schema.Types.ObjectId, ref: 'productAuction' },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bidPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    auctionStatus: {
      type: String,
      enum: ['won', 'pending', 'lose','canceled','temporary','expired','paid'],
      default: 'won'
    },
    status: { type: String, default: "active" },
    auctionStausCheck: {
      type: String,
      enum: ["Chờ duyệt", "Xử lý duyệt", "Đã duyệt hủy chiến thắng"],
      default: "Chờ duyệt",
    },
    confirmationStatus: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
    hasWinner: { type: Boolean},
    notWinner:{ type: Boolean},
    startTime: { type: Date, default: Date.now, required: true },
    endTime: { type: Date, required: true },
    remainingTime: { type: String },
    noteAuctionWinner: { type: String },
    emailSent: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "auctionWinner",
    timestamps: true,
  }
);

module.exports = model("AuctionWinner", auctionWinnerSchema);
