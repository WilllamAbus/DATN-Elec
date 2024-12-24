const { Schema, model } = require("mongoose");

const auctionWinnerReturnSchema = new Schema(
  {
    auctionPricingRangeReturn: { 
      type: Schema.Types.ObjectId, 
      ref: 'AuctionPricingRange',
      required: true 
    },
    auctionRoundReturn: { 
      type: Schema.Types.ObjectId, 
      ref: 'AuctionRound', 
      required: true 
    },
    userReturn: { 
      type: Schema.Types.ObjectId, 
      ref: 'users', 
      required: true 
    },
    bidPriceReturn: { 
      type: Number, 
      required: true 
    },
    isPaymentReturnStatus: { 
      type: String, 
    //   enum: ['pending', 'paid', 'failed'], 
      default: 'failed' 
    },
    auctionReturnStatus: { 
      type: String, 
    //   enum: ['won', 'pending','canceled'], 
      default: 'canceled' 
    },
    status:{
        status: { type: String, default: 'disable' },
    },
    auctionStausIsCheck:{
        type: String, 
  
        default: 'Đã duyệt' 
    },
    coundDisabledAuction :{type: "Number", default: 1},
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  {
    collection: "auctionWinnerReturn", 
    timestamps: true,
  }
);

module.exports = model("AuctionWinnerReturn", auctionWinnerReturnSchema);