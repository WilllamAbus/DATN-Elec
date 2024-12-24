const { Schema, model } = require("mongoose");

const cartItemSchema = new Schema({
  auctions: { type: Schema.Types.ObjectId, ref: "auctions", required: true },
  product: { type: Schema.Types.ObjectId, ref: "product_v2", required: true },
  productVariant: { type: Schema.Types.ObjectId, ref: "productVariant" },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  totalItemPrice: { type: Number, required: true },
  isSelected: { type: Boolean, default: false },
  inventory: { type: Schema.Types.ObjectId, ref: "Inventory" },
});
const cartItemAuctionSchema = new Schema({
  auctionWiner: { type: Schema.Types.ObjectId, ref: "AuctionWinner", required: true },
  auctionStartTime: { type: Date, default: null },
  auctionEndTime: { type: Date, default: null },
});

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    items: [cartItemSchema, cartItemAuctionSchema],

    totalPrice: { type: Number, required: true },
    stateNotifi: { type: String, default: "has" },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "carts",
    timestamps: true,
  }
);

// Tạo mô hình từ schema
module.exports = model("Cart", cartSchema);
