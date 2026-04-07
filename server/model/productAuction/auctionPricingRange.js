  const { Schema, model } = require("mongoose");

  const auctionPricingRangeSchema = new Schema(
    {
      startTime: { type: Date, required: true },  
      endTime: { type: Date, required: true },   
      remainingTime: { type: String },
      startingPrice: { type: Number, required: true }, 
      maxPrice: { type: Number, required: true },      
      currentPrice: { type: Number},  
      currentPriceTemporarily: { type: Number },
      startTimeTemporarily: { type: Date }, 
      endTimeTemporarily: { type: Date },
      remainingTimeTemporarily: { type: String },
      priceStep: { type: Number, required: true }, 
      status: { type: String, default: 'active' },   /**'active','ended','deleted' */
      product_randBib:{ type: Schema.Types.ObjectId, ref: 'productAuction' },
      auctionPriceHistory:{ type: Schema.Types.ObjectId, ref: 'AuctionPriceHistory' },
      isPriceStepAdjusted: { type: Boolean, default: false },
      checkCurrentPrice: { type: Number },
      hasWinner: { type: Boolean},
      emailSent: { type: Boolean, default: false },
    },
    {
      collection: "auctionPricingRange",
      timestamps: true,
    }
  );

  module.exports = model("AuctionPricingRange", auctionPricingRangeSchema);
