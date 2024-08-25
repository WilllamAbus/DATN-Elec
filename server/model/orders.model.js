const { Schema, model } = require('mongoose');
const paymentSchema = require('./payment.model'); // Import paymentSchema từ mô hình của bạn
const shippingSchema = require('./shipping.model'); // Import shippingSchema từ mô hình của bạn
const voucherSchema = require('./voucher.model'); // Import voucherSchema từ mô hình của bạn
const formatShoppingSchema = require('./formatShopping.model'); // Import formatShoppingSchema từ mô hình của bạn

const ordersSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Người dùng thực hiện thanh toán
  cartItems: [{ type: Schema.Types.ObjectId, ref: 'carts', default: [] }], // Tham chiếu đến giỏ hàng nếu có
  auctionItems: [{ type: Schema.Types.ObjectId, ref: 'auctions', default: [] }], // Tham chiếu đến sản phẩm đấu giá thành công nếu có
  payment: { type: paymentSchema, required: true }, // Thông tin thanh toán sử dụng schema riêng
  shippingAddress: { type: shippingSchema, required: true }, // Thông tin địa chỉ giao hàng sử dụng schema riêng
  voucher: [voucherSchema],
  formatShipping: { // Thông tin về cách vận chuyển
    type: {
      type: String,
      enum: ['Tiêu chuẩn', 'Giao nhanh'], // Các loại vận chuyển
      required: true
    },
    price: { type: Number, required: true } // Phí vận chuyển tương ứng với loại
  },
  formatShopping: { // Thông tin về formatShopping
    type: formatShoppingSchema, // Thay thế bằng kiểu của formatShoppingSchema
    required: true
  },
  totalAmount: { type: Number, required: true }, // Tổng số tiền thanh toán
  shippingFee: { type: Number, default: 31000 }, // Phí vận chuyển
  totalPriceWithShipping: { type: Number, required: true }, // Tổng giá bao gồm phí vận chuyển
  stateOrder: { type: String,
    enum: ["Xử lý", "Xác nhận", "Hủy bỏ"], // Chỉ định các giá trị hợp lệ cho status
    default: "Xử lý",
    required: true,
     }, // Trạng thái của đơn hàng
  order_date: { type: Date, default: Date.now }, // Ngày đặt hàng
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  status: { type: String, default: 'active' },
  disabledAt: { type: Date, default: null }, // Thời gian tạo đơn hàng
},{
    collection:"orders",
    timestamps:true
});

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

module.exports = model('orders', ordersSchema);
