const { Schema, model } = require("mongoose");

const auctionWinnerReturnSchema = new Schema(
  {

  
    cancelledProducts: [
      {
        auctionWinnerReturn: { 
          type: Schema.Types.ObjectId, 
          ref: 'AuctionWinner', 
          required: true 
        },
        productName: { 
          type: String, 
        
        },
        quantity: { 
          type: Number,  
          default: 1
        },
        image: { 
          type: String,  
    
        },
      }
    ],
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
    countDisabledAuction: { type: Number, default: 1 }, // Sửa lỗi kiểu
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