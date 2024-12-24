  const { Schema, model } = require("mongoose");

  const auctionPricingRangeSchema = new Schema(
    {
      startTime: { type: Date, required: true },  
      endTime: { type: Date, required: true },   
      startingPrice: { type: Number, required: true }, 
      maxPrice: { type: Number, required: true },      
      currentPrice: { type: Number},  
      priceStep: { type: Number, required: true }, 
      status: { type: String,
        //  enum: ['active', 'ended', 'disable'], 
      }, 
      product_randBib:{ type: Schema.Types.ObjectId, ref: 'productAuction' },
      auctionPriceHistory:{ type: Schema.Types.ObjectId, ref: 'AuctionPriceHistory' },
    },
    {
      collection: "auctionPricingRange",
      timestamps: true,
    }
  );

  module.exports = model("AuctionPricingRange", auctionPricingRangeSchema);
