const { Schema, model } = require("mongoose");


const orderAuctionSchema = new Schema(
  {
    shippingAddress: {
      userID: { type: Schema.Types.ObjectId, ref: "users", required: true },
      recipientName: { type: String }, // Tên người nhận
      phoneNumber: { type: String }, // Số điện thoại người nhận
      address: { type: String },
      email: { type: String },
      addressID: { type: String },
    },
    stateOrder: {
      type: String,
   
      enum: ["Chờ giao hàng","Chờ xử lý", 
        "Đã xác nhận",  "Vận chuyển",
          "Nhận hàng", "Hoàn tất", 
          "Hủy đơn hàng", 
          "Giao hàng không thành công",
          "Hoàn tiền", "Chờ xử lý hoàn tiền", "Đã xác nhận hoàn tiền", "Hoàn tiền thành công"], // Order status
    },
 
    refundBank: {
      bankCode: { type: String, required: false }, // Tên ngân hàng
      orderInForVnPay: { type: String, required: false },
      paymentDateVnPay: { type: String, required: false }, // Số tài khoản
      transiTionAmout: { type: String, required: false }, // Tên chủ tài khoản
    },
    order_date: { type: Date, default: Date.now }, // Order date
    createdAt: { type: Date, default: Date.now },

    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null }, // Disabled date if applicable
  },

  {
    collection: "orderAuctions",
    timestamps: true,
  }
);


module.exports = model("orderAuctions", orderAuctionSchema);
