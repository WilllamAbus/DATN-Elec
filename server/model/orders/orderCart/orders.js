const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    cartDetails: [{ type: Schema.Types.ObjectId, ref: "OrderDetail" }],
    payment: { type: Schema.Types.ObjectId, ref: "payment", required: true },
    shipping: { type: Schema.Types.ObjectId, ref: "shipping", required: true },
    voucherIds: [{ type: Schema.Types.ObjectId, ref: "voucher" }],

    formatShipping: {
      type: String,
      enum: ["Tiêu chuẩn", "Nhanh"],
      required: true,
    },

    // totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 31000 },
    totalPriceWithShipping: { type: Number, required: true },
    stateOrder: {
      type: String,
      enum: [
        "Chờ xử lý",
        "Đã xác nhận",
        "Đóng gói",
        "Đang vận chuyển",
        "Hoàn tất",
        "Hủy đơn hàng",
        "Đã hoàn tiền",
        "Giao hàng không thành công",
        "Trả hàng về cửa hàng",
      ],
      required: true,
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    cancelReason: { type: String, default: null },
    status: { type: String, default: "active" },
    refundBank: {
      bankName: { type: String, required: false },
      accountNumber: { type: String, required: false },
      accountName: { type: String, required: false },
    },
  },
  {
    collection: "OrderCart",
    timestamps: true,
  }
);

module.exports = model("OrderCart", orderSchema);
