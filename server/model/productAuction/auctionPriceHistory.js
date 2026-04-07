
const { Schema, model } = require("mongoose");

const auctionPriceHistorySchema = new Schema(
  {
    auctionPricingRange: { type: Schema.Types.ObjectId, ref: 'AuctionPricingRange', required: true }, 
    auctionRound: { type: Schema.Types.ObjectId, ref: 'AuctionRound', required: true }, 
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true }, 
    bidPrice: { type: Number, required: true }, 
    bidTime: { type: Date, default: Date.now }, 
    status: { type: String, default: 'active' },
    emailSent: { type: Boolean, default: false },
  },
  {
    collection: "auctionPriceHistory", 
    timestamps: true, 
  }
);

module.exports = model("AuctionPriceHistory", auctionPriceHistorySchema);
