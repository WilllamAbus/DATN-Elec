const { Schema, model } = require("mongoose");

const interactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    orderAuctions: { type: Schema.Types.ObjectId, ref: "orderAuctions" },
    item: { type: Schema.Types.ObjectId, ref: "product_v2" },
    OrderCart: { type: Schema.Types.ObjectId, ref: "OrderCart" },
    Watchlist: { type: Schema.Types.ObjectId, ref: "Watchlist" },
    productID: { type: String },
    type: {
      type: String,
      enum: ["view", "comment", "add wishlist", "purchase", "auctions"], // Các loại tương tác
      required: true,
    },
    score: { type: Number, default: 1 }, // Điểm số cho mô hình học, bạn có thể thay đổi dựa trên loại tương tác

    modifieon: { type: Date, default: Date.now },
    status: { type: String, default: "active" },
    isActive: { type: Boolean, default: true },

    disabledAt: { type: Date, default: null },
  },
  {
    collection: "interaction",
    timestamps: true,
  }
);

module.exports = model("interaction", interactionSchema);
