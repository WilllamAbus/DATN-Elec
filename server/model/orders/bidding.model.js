const { Schema, model } = require("mongoose");

const biddingSchema = Schema(
  {
    product_bidding: { type: Schema.Types.ObjectId, ref: 'product_v2', required: true }, // Sản phẩm duy nhất đang được đấu giá
    biddser: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Người dùng thực hiện đấu giá
    bidAmount: { type: Number, required: true }, // Số tiền đấu giá
    bidTime: { type: Date, default: Date.now }, // Thời gian thực hiện đấu giá
    isWinningBid: { type: Boolean, default: false }, // Đánh dấu lượt đấu giá là thắng cuộc hay không
    biddingQuantity: {type:Number, default: 1},
    priceRange: {
      min: { type: Number, default: 0 }, // Giá thấp nhất
      max: { type: Number, default: 0 }, // Giá cao nhất
      avg: { type: Number, default: 0 }, // Giá trung bình
      freePrice: { type: Number, default: 0 } // Giá tự do
    },

    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "bidding",
    timestamps: true,
  }
);

module.exports = model("bidding", biddingSchema);