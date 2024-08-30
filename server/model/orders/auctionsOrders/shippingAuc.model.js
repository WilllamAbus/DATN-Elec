const { Schema, model } = require("mongoose");




const shippingAuctionSchema = new Schema(
  {
   users: {type: Schema.Types.ObjectId, ref: "users"},
  recipientName: { type: String, required: true }, // Tên người nhận
  phoneNumber: { type: String, required: true }, // Số điện thoại người nhận
  address: { type: String, required: true }, // Địa chỉ giao hàng
  province: { type: String, required: true }, // Tỉnh
  districts: { type: String, required: true }, // Quận/Huyện
  ward: { type: String, required: true }, // Xã/Phường
  stateShipping: {
    type: String,
    enum: ['Xác nhận', 'Xử lý', 'Hủy'], // Các giá trị cho trạng thái
    require:true // Giá trị mặc định
  },
  modifieon: { type: Date, default: Date.now }, // Ngày cập nhật giỏ hàng

  status: { type: String, default: 'active' },
  disabledAt: { type: Date, default: null },

  },
  {
    collection: "shippingAuction",
    timestamps: true,
  }
);


module.exports = model("shippingAuction",shippingAuctionSchema);
