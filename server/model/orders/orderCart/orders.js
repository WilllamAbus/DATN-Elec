const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    cartDetails: [{ type: Schema.Types.ObjectId, ref: "OrderDetail" }],
    payment: { type: Schema.Types.ObjectId, ref: "payment", default: null },
    shipping: {
      type: Schema.Types.ObjectId,
      ref: "shipping",
      required: true,
    },
    voucherIds: [{ type: Schema.Types.ObjectId, ref: "voucher" }],
    formatShipping: {
      type: String,
      enum: ["Tiêu chuẩn", "Nhanh"],
      required: true,
    },
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 31000 },
    totalPriceWithShipping: { type: Number, required: true },
    stateOrder: {
      type: String,
      enum: [
        "Chờ xử lý",
        "Đã xác nhận",
        "Đang vận chuyển",
        "Hoàn tất",
        "Hủy đơn hàng",
      ],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date, default: null },
    createdAt: {
      type: Date,
      default: moment.tz("Asia/Ho_Chi_Minh").toDate(),
    },
    updatedAt: {
      type: Date,
      default: moment.tz("Asia/Ho_Chi_Minh").toDate(),
    },
  },

  {
    collection: "OrderCart",
    timestamps: true,
  }
);
orderSchema.pre("save", function (next) {
  const now = moment.tz("Asia/Ho_Chi_Minh").toDate();
  this.updatedAt = now; // Cập nhật updatedAt
  if (!this.createdAt) {
    this.createdAt = now; // Nếu chưa có createdAt, gán giá trị
  }
  next();
});
module.exports = model("OrderCart", orderSchema);
