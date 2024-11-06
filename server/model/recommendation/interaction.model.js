const { Schema, model } = require("mongoose");

const interactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    orderAuctions: { type: Schema.Types.ObjectId, ref: "orderAuctions" },
    item: { type: Schema.Types.ObjectId, ref: "product_v2" },
    productVariant: { type: Schema.Types.ObjectId, ref: "productVariant" },
    OrderCart: { type: Schema.Types.ObjectId, ref: "OrderCart" },
    Watchlist: { type: Schema.Types.ObjectId, ref: "Watchlist" },
    Cart: { type: Schema.Types.ObjectId, ref: "Cart" },
    productID: { type: String },
    productAuction: { type: String },
    type: {
      type: String,
      enum: ["view", "comment", "add wishlist", "purchase", "auctions", "cart"],
      required: true,
    },
    score: { type: Number, default: 1 },

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
