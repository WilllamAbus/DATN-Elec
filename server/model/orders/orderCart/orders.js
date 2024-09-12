const { Schema, model } = require("mongoose");
const orderItem = require("./orderItem");

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    cartDetails: [orderItem],
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
        "Trả hàng",
        "Hủy đơn hàng",
      ],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "OrderCart",
    timestamps: true,
  }
);

module.exports = model("OrderCart", orderSchema);
