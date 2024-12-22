const { Schema, model } = require("mongoose");

const auctionSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'ProductAuction', required: true },  // Sản phẩm đang được đấu giá
    winnerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },  // Người thắng cuộc
    winningPrice: { type: Number, default: 0 },  // Giá thắng cuộc
    status: { type: String, enum: ['ongoing', 'completed', 'failed'], default: 'ongoing' },  // Trạng thái đấu giá
    paymentStatus: { type: String, enum: ['pending', 'paid', 'payment_failed'], default: 'pending' },  // Trạng thái thanh toán
    endTime: { type: Date, required: true },  // Thời gian kết thúc phiên đấu giá
    paymentDeadline: { type: Date, required: true },  // Thời gian thanh toán hết hạn (sau khi đấu giá thành công)
  },
  {
    collection: "Auctions",
    timestamps: true,
  }
);

module.exports = model("Auctions", auctionSchema);
