const { Schema, model } = require("mongoose");

const userBidPriceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    bidPrice: { type: Number, required: true },
    auctionPricingRange: { type: Schema.Types.ObjectId, ref: 'AuctionPricingRange', required: true },
  },
  {
    collection: "userBidPrice",
    timestamps: true,
  }
);

module.exports = model("UserBidPrice", userBidPriceSchema);
