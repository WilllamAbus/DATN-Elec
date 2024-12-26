const { Schema, model } = require("mongoose");

const auctionWinnerReturnSchema = new Schema(
  {

    auctionWinnerReturn: { 
      type: Schema.Types.ObjectId, 
      ref: 'AuctionWinner',
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
     enum: ['Cảnh cáo tiếp theo ', 'Cảnh cáo lần cuối','Hủy tài khoản'], 
        default: 'Đã duyệt hủy chiển thắng' 
    },
    coundDisabledAuction :{type: "Number", default: 1},
    mess :{type: "String"},
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