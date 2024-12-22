const { Schema, model } = require("mongoose");

const biddingSchema = Schema(
    {
        product_bidding: {
          productId: { type: Schema.Types.ObjectId, ref: 'productAuction' }, 
          product_name: { type: String },
        }, // Sản phẩm duy nhất đang được đấu giá
     
        bidder: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Người dùng thực hiện đấu giá
        bidAmount: { type: Number, required: true },
        
        bidTime: { type: Date },
        bidEndTime: {  type: Schema.Types.ObjectId, ref: 'timetrack', required: true  }, // Thời gian kết thúc đấu giá // Thời gian thực hiện đấu giá
        biddingQuantity: { type: Number, default: 1 },
        priceRange: {
          type: Schema.Types.ObjectId, 
          ref: 'priceRangeBid', 
          required: true 
        },
        stateBidding :{
          type:String,
          enum:['Tiến hành thanh toán', 'Xử lý', 'Xác nhận', 'Thắng', 'Lần sau'],
          // default:'Đang đấu giá'
        },
        isActive: { type: Boolean, default: false },
        status: { type: String, default: "active" },
        disabledAt: { type: Date, default: null },
      },
  {
    collection: "bidding",
    timestamps: true,
  }
);

module.exports = model("bidding", biddingSchema);
