const { Schema, model } = require("mongoose");

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'product_v2', required: true }, // Tham chiếu đến mô hình Product (Sản phẩm)
    quantity: { type: Number,  default: 1 }, // Số lượng sản phẩm trong giỏ
    price: { type: Number, required: true }, // Giá của sản phẩm tại thời điểm thêm vào giỏ hàng
    totalItemPrice: { type: Number, required: true } // Tổng giá cho sản phẩm này (quantity * price)
  });
const cartSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Người dùng sở hữu giỏ hàng
    items: [cartItemSchema], // Mảng các sản phẩm trong giỏ hàng
    totalPrice: { type: Number, required: true,  }, // Tổng giá trị của toàn bộ giỏ hàng

    modifieon: { type: Date, default: Date.now }, // Ngày cập nhật giỏ hàng
    stateNotifi: { type: String, default: 'has' },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "carts",
    timestamps: true,
  }
);

module.exports = model("carts", cartSchema);