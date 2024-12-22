const { Schema, model } = require("mongoose");

const auctionPricingRangeSchema = new Schema(
  {
    startTime: { type: Date, required: true },  // Thời gian bắt đầu
    endTime: { type: Date, required: true },    // Thời gian kết thúc
    startingPrice: { type: Number, required: true },  // Giá khởi điểm
    maxPrice: { type: Number, required: true },       // Giá tối đa
    currentPrice: { type: Number, default: 0 },  // Giá hiện tại (sẽ cập nhật khi bước giá tăng)
    priceStep: { type: Number, required: true },  // Bước giá
    userBidPrice: { type: Number, default: null } ,
    status: { type: String, default: 'active' },
    product_randBib:{ type: Schema.Types.ObjectId, ref: 'productAuction' },
  },
  {
    collection: "auctionPricingRange",
    timestamps: true,
  }
);

module.exports = model("AuctionPricingRange", auctionPricingRangeSchema);
