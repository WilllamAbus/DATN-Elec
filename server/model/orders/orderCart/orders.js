const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    cartDetails: [{ type: Schema.Types.ObjectId, ref: "OrderDetail" }],
    payment: { type: Schema.Types.ObjectId, ref: "payment", default: null },
    shipping: { type: Schema.Types.ObjectId, ref: "shipping", required: true },
    voucherIds: [{ type: Schema.Types.ObjectId, ref: "voucher" }],

    // Loại giao hàng (Tiêu chuẩn, Nhanh)
    formatShipping: {
      type: String,
      enum: ["Tiêu chuẩn", "Nhanh"],
      required: true,
    },

    // Tổng tiền và phí giao hàng
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 31000 },
    totalPriceWithShipping: { type: Number, required: true },

    // Trạng thái đơn hàng
    stateOrder: {
      type: String,
      enum: [
        "Chờ xử lý",
        "Đã xác nhận",
        "Đang vận chuyển",
        "Hoàn tất",
        "Hủy đơn hàng",
        "Đã hoàn tiền",
      ],
      required: true,
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    cancelReason: { type: String, default: null },

    refundBank: {
      bankName: { type: String, required: false }, // Tên ngân hàng
      accountNumber: { type: String, required: false }, // Số tài khoản
      accountName: { type: String, required: false }, // Tên chủ tài khoản
    },
    createdAt: { type: Date, default: moment.tz("Asia/Ho_Chi_Minh").toDate() },
    updatedAt: { type: Date, default: moment.tz("Asia/Ho_Chi_Minh").toDate() },
  },
  {
    collection: "OrderCart",
    timestamps: true,
  }
);

// Cập nhật thời gian khi lưu
orderSchema.pre("save", function (next) {
  const now = moment.tz("Asia/Ho_Chi_Minh").toDate();
  this.updatedAt = now;
  if (!this.createdAt) this.createdAt = now;
  next();
});

module.exports = model("OrderCart", orderSchema);
