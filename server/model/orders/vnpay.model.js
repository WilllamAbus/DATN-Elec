const { Schema, model } = require("mongoose");

const VnpaySchema = new Schema(
  {
    amount: { type: Number, required: true }, // Số tiền thanh toán
    transaction: { type: String }, // Mã giao dịch
    bank_code: { type: String }, // Mã ngân hàng
    card_type: { type: String }, // Loại thẻ
    order_info: { type: String }, // Thông tin đơn hàng
    payment_date: { type: String }, // Ngày thanh toán
    transaction_status: { type: String }, // Trạng thái giao dịch
    response_code: { type: String }, // Mã phản hồi từ VNPay
    payment_method: {
      type: String,
      enum: ["MoMo", "cash", "vnPay"],
      required: true,
    },
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "vnpay",
    timestamps: true,
  }
);

module.exports = model("vnpay", VnpaySchema);
