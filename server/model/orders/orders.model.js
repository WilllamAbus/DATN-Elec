const { Schema, model } = require("mongoose");
// Import formatShoppingSchema từ mô hình của bạn

const ordersSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Reference to user
    cartDetails: [
      { type: Schema.Types.ObjectId, ref: "orderCarts", default: [] },
    ], // Reference to orderCarts
    auctionDetails: [
      { type: Schema.Types.ObjectId, ref: "orderAuctions", default: [] },
    ], // Reference to orderAuctions

    // Store IDs as strings
    paymentId: { type: Schema.Types.ObjectId, ref: "payment", require: true }, // ID of the payment
    shippingAddressId: {
      type: Schema.Types.ObjectId,
      ref: "shipping",
      require: true,
    }, // ID of the shipping address

    // Array of voucher IDs as strings
    voucherIds: [
      { type: Schema.Types.ObjectId, ref: "voucher", require: true },
    ], // IDs of applied vouchers

    // Shipping details as embedded object
    formatShipping: {
      type: {
        type: String,
        enum: ["Tiêu chuẩn"], // Example shipping types
        required: true,
      },
    },

    // Calculated fields
    totalAmount: { type: Number, required: true }, // Total amount before shipping
    shippingFee: { type: Number, default: 31000 }, // Shipping fee
    totalPriceWithShipping: { type: Number, required: true },

    stateOrder: {
      type: String,
      enum: ["Tiêu chuẩn"], // Example shipping types
      required: true,
    },
  },

  //   // Calculated fields
  //   totalAmount: { type: Number, required: true }, // Total amount before shipping
  //   shippingFee: { type: Number, default: 31000 }, // Shipping fee
  //   totalPriceWithShipping: { type: Number, required: true },

  //   stateOrder: {
  //     type: String,
  //     enum: ["Chờ xử lý", "Đang xử lý", "Đang vận chuyển"], // Order status

  //     required: true,
  //   },
  //   order_date: { type: Date, default: Date.now }, // Order date
  //   createdAt: { type: Date, default: Date.now },

  //   status: { type: String, default: "active" },
  //   disabledAt: { type: Date, default: null }, // Disabled date if applicable
  // },

  {
    collection: "orders",
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

module.exports = model("orders", ordersSchema);
