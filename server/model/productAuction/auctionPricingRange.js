const { Schema, model } = require("mongoose");

const auctionPricingRangeSchema = new Schema(
  {
    startTime: { type: Date, required: true },  // Thời gian bắt đầu
    endTime: { type: Date, required: true },    // Thời gian kết thúc
    startingPrice: { type: Number, required: true },  // Giá khởi điểm =  cái giá nhập hàng
    maxPrice: { type: Number, required: true },       // Giá tối đa 2.400.000
    currentPrice: { type: Number, default: 0 },  // Giá hiện tại 2.000.000 + 100 = 2.100.000
    priceStep: { type: Number, required: true },  // Bước giá 100 khi mà giá hiện tại sát giá tối đa thì kiểm tra bước giá giá hiện tại 
    userBidPrice: { type: Number, default: null },// Giá do người dùng nhập 2.400 hoặc là muốn đấu giá cao hơn ở bước giá = 2.350.000
    status: { type: String, default: 'active' },
    product_randBib:{ type: Schema.Types.ObjectId, ref: 'productAuction' },
  },
  {
    collection: "auctionPricingRange",
    timestamps: true,
  }
);

module.exports = model("AuctionPricingRange", auctionPricingRangeSchema);
