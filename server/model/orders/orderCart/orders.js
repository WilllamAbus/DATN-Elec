const { Schema, model } = require("mongoose");

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
        "Giao hàng không thành công",
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
  },
  {
    collection: "OrderCart",
    timestamps: true,
  }
);

// Cập nhật thời gian khi lưu

module.exports = model("OrderCart", orderSchema);
