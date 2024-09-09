const { Schema, model } = require("mongoose");

// Định nghĩa schema cho các mục trong giỏ hàng
const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "product_v2", required: true }, // Tham chiếu đến mô hình Product
  quantity: { type: Number, default: 1 }, // Số lượng sản phẩm trong giỏ
  price: { type: Number, required: true }, // Giá của sản phẩm
  totalItemPrice: { type: Number, required: true }, // Tổng giá cho sản phẩm (quantity * price)
  isSelected: { type: Boolean, default: false }, // Trạng thái chọn sản phẩm để thanh toán
});

// Định nghĩa schema cho giỏ hàng
const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Người dùng sở hữu giỏ hàng
    items: [cartItemSchema], // Mảng các sản phẩm trong giỏ hàng
    totalPrice: { type: Number, required: true }, // Tổng giá trị của toàn bộ giỏ hàng, được tính toán từ frontend
    stateNotifi: { type: String, default: "has" }, // Trạng thái thông báo
    isActive: { type: Boolean, default: true }, // Trạng thái hoạt động của giỏ hàng
    status: { type: String, default: "active" }, // Trạng thái của giỏ hàng
    disabledAt: { type: Date, default: null }, // Thời điểm giỏ hàng bị vô hiệu hóa
  },
  {
    collection: "carts", // Tên collection trong MongoDB
    timestamps: true, // Tạo tự động các trường createdAt và updatedAt
  }
);

// Tạo mô hình từ schema
module.exports = model("Cart", cartSchema);
