const { Schema, model } = require("mongoose");

const shippingSchema = new Schema(
  {
    recipientName: { type: String, required: true }, // Tên người nhận
    phoneNumber: { type: String, required: true }, // Số điện thoại người nhận
    address: { type: String, required: true }, // Địa chỉ giao hàng
    stateShipping: {
      type: String,
      enum: ["Xác nhận", "Xử lý", "Hủy"], // Các giá trị cho trạng thái
      required: true, // Giá trị mặc định
    },
    modifieon: { type: Date, default: Date.now }, // Ngày cập nhật giỏ hàng
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "shipping",
    timestamps: true,
  }
);

module.exports = model("shipping", shippingSchema);
