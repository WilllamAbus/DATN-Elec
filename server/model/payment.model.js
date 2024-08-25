const { Schema, model } = require("mongoose");




const paymentSchema = new Schema(
  {
   
    amount: { type: Number, required: true }, // Số tiền thanh toán
    payment_date: { type: Date, default: Date.now }, // Ngày thanh toán, mặc định là ngày hiện tại
    payment_method: {
      type: String,
      enum: ["MoMo", "Thanh toán trực tiếp"], // Chỉ định các giá trị hợp lệ cho payment_method
      required: true,
    },
    statePayment: {
      type: String,
      enum: ["Xử lý", "Xác nhận", "Hủy bỏ"], // Chỉ định các giá trị hợp lệ cho status
      default: "Xác nhận",
      required: true,
    },
  isActive: { type: Boolean, default: true },
  status: { type: String, default: 'active' },
  disabledAt: { type: Date, default: null },

  },
  {
    collection: "payment",
    timestamps: true,
  }
);


module.exports = model("payment",paymentSchema);