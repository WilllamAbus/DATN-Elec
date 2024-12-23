const { Schema, model } = require("mongoose");

const auctionRoundSchema = new Schema(
  {
    auctionPricing: { type: Schema.Types.ObjectId, ref: 'AuctionPricingRange', required: true }, 
    participants: [{ type: Schema.Types.ObjectId, ref: 'users' }], 
    bids: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'users' }, 
        bidPrice: { type: Number, required: true },        
        bidTime: { type: Date, default: Date.now },           
      }
    ],
    status: { type: String, default: 'active' },            
  },
  {
    collection: "auctionRound",
    timestamps: true,
  }
);

module.exports = model("AuctionRound", auctionRoundSchema);
