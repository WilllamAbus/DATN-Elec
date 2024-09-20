const { Schema, model } = require("mongoose");

const VnpaySchema = new Schema(
  {
    amount: { type: Number, required: true },
    transaction: { type: String },
    bank_code: { type: String },
    card_type: { type: String },
    order_info: { type: String },
    payment_date: { type: String },
    transaction_status: { type: String },
    response_code: { type: String },
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
