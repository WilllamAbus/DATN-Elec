const { Schema, model } = require("mongoose");

const paymentSchema = new Schema(
  {
    amount: { type: Number, required: true }, // Số tiền thanh toán
    order_info: { type: String },
    payment_method: {
      type: String,
      enum: ["MoMo", "Thanh toán khi nhận hàng", "vnPay"], // Chỉ định các giá trị hợp lệ cho payment_method
      required: true,
    },

    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "payment",
    timestamps: true,
  }
);

module.exports = model("payment", paymentSchema);
// const { Schema, model } = require("mongoose");

// const paymentSchema = new Schema(
//   {
//     amount: { type: Number, required: true }, // Số tiền thanh toán
//     transaction: { type: String }, // Mã giao dịch
//     bank_code: { type: String }, // Mã ngân hàng
//     card_type: { type: String }, // Loại thẻ
//     order_info: { type: String }, // Thông tin đơn hàng
//     payment_date: { type: String }, // Ngày thanh toán
//     transaction_status: { type: String }, // Trạng thái giao dịch
//     response_code: { type: String }, // Mã phản hồi từ VNPay
//     payment_method: {
//       type: String,
//       enum: ["MoMo", "cash", "vnPay"],
//       required: true,
//     },
//     status: { type: String, default: "active" },
//     disabledAt: { type: Date, default: null },
//   },
//   {
//     collection: "payment",
//     timestamps: true,
//   }
// );

// module.exports = model("payment", paymentSchema);
// const { Schema, model } = require("mongoose");

// const paymentSchema = new Schema(
//   {
//     amount: { type: Number, required: true }, // Số tiền thanh toán
//     order_info: { type: String }, // Thông tin đơn hàng
//     payment_method: {
//       type: String,
//       enum: ["MoMo", "cash", "vnPay"], // Chỉ định các phương thức thanh toán hợp lệ
//       required: true,
//     },
//     // payment_date: { type: Date, default: Date.now }, // Ngày thanh toán
//     status: { type: String, default: "active" },
//     disabledAt: { type: Date, default: null },

//     // Các thông tin chi tiết nếu payment_method là "vnPay"
//     vnPayDetails: {
//       transaction: { type: String }, // Mã giao dịch
//       bank_code: { type: String }, // Mã ngân hàng
//       card_type: { type: String }, // Loại thẻ
//       response_code: { type: String }, // Mã phản hồi từ VNPay
//       transaction_status: { type: String }, // Trạng thái giao dịch
//     },
//   },
//   {
//     collection: "payment",
//     timestamps: true, // Tự động tạo createdAt và updatedAt
//   }
// );

// module.exports = model("payment", paymentSchema);
