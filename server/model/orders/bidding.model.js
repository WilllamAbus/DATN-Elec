const { Schema, model } = require("mongoose");

const biddingSchema = Schema(
  {
    product_bidding: {  
    productId: { type: Schema.Types.ObjectId, ref: 'product_v2' }, 
    product_name: { type: String },
  

 }, // Sản phẩm duy nhất đang được đấu giá
    biddser: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Người dùng thực hiện đấu giá
    bidAmount: { type: Number, required: true }, // Số tiền đấu giá
    bidTime: { type: Date }, // Thời gian thực hiện đấu giá
  
    biddingQuantity: {type:Number, default: 1},
    priceRange: {
        type: Schema.Types.ObjectId, ref: 'priceRangeBid', required: true 
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
