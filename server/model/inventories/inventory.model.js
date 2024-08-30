const { Schema, model } = require("mongoose");

const inventorySchema = Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    //số lượng lấy khi thêm product sẽ thêm vào đây luôn
    quantity: { type: Number, required: true },//khi số lượng này nhỏ hơn 10 sẽ thông báo cần nhập hàng
    //supplier này cũng từ product qua
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    // Giá mỗi đơn vị sản phẩm
    price: { type: Number, required: true }, // Giá của sản phẩm (đơn giá)
    // Tổng giá trị tồn kho
    totalPrice: { type: Number, required: true }, // Tổng giá trị = số lượng * giá
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: "inventory",
  }
);

// Trước khi lưu trữ hoặc cập nhật tài liệu
inventorySchema.pre("save", function (next) {
  if (this.quantity < 0) {
    return next(new Error("Quantity cannot be negative."));
  }
  next();
});
module.exports = model("inventory", inventorySchema);