const { Schema, model } = require("mongoose");

const auctionWinnerReturnSchema = new Schema(
  {

    auctionWinnerReturn: { 
      type: Schema.Types.ObjectId, 
      ref: 'AuctionWinner',
      required: true 
    },
    auctionWinnerUserReturn: { 
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

      default: 'failed' 
    },
    auctionReturnStatus: { 
      type: String, 
 
      default: 'canceled' 
    },
    status: { type: String, default: 'deleted' },
    auctionStausIsCheck:{
        type: String, 
        enum: ['Đã duyệt hủy chiến thắng',
          'Cảnh báo đầu tiên', 
          'Cảnh báo cuối cùng',
          'Khóa tài khoản'], 
    
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