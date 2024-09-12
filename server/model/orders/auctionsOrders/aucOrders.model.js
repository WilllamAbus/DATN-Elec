const { Schema, model } = require("mongoose");
// Import formatShoppingSchema từ mô hình của bạn

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
      enum: ["Chờ giao hàng", "Hủy bỏ", "Xác nhận", "Nhận hàng"], // Order status
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

// Tính tổng giá bao gồm phí vận chuyển trước khi lưu
// ordersSchema.pre('save', async function (next) {
//   try {
//     // Tính tổng giá từ giỏ hàng
//     let totalAmount = 0;
//     if (this.cartItems.length > 0) {
//       for (const itemId of this.cartItems) {
//         // Giả sử bạn đã lưu thông tin giá sản phẩm trong cartItems
//         // Bạn có thể cần truy vấn để lấy thông tin giá sản phẩm từ itemId
//         const item = await Cart.findById(itemId); // Thay thế Cart bằng mô hình tương ứng
//         totalAmount += item.price * item.quantity;
//       }
//     }

//     // Cập nhật tổng số tiền và phí vận chuyển
//     this.totalAmount = totalAmount;
//     this.shippingFee = this.formatShipping.price; // Sử dụng giá phí vận chuyển từ formatShipping
//     this.totalPriceWithShipping = this.totalAmount + this.shippingFee;

//     // Áp dụng voucher nếu có
//     if (this.voucher) {
//       const voucher = await Voucher.findById(this.voucher); // Thay thế Voucher bằng mô hình tương ứng
//       if (voucher) {
//         // Giả sử voucher có thuộc tính discountAmount
//         this.totalPriceWithShipping -= voucher.discountAmount;
//       }
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = model("orderAuctions", orderAuctionSchema);
