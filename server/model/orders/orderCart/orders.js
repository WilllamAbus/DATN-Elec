const { Schema, model } = require("mongoose");
const moment = require("moment-timezone");

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    cartDetails: [{ type: Schema.Types.ObjectId, ref: "OrderDetail" }], // Link tới các chi tiết sản phẩm trong đơn hàng
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
      ],
      required: true,
    },

    // Trạng thái xóa đơn hàng
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    // Thời gian tạo và cập nhật
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
