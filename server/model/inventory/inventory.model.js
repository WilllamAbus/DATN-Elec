const { Schema, model } = require("mongoose");
const inventorySchema = Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "product_v2", required: true },
    quantityProduct: {type:Number}, // totalQuantity - quantityStock
    quantityStock: {type:Number}, // số lượng này sẽ là số lượng đưa qua product
    totalQuantity : {type: Number, required: true}, // số lượng tồn kho 100
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    // Giá mỗi đơn vị sản phẩm
    price: { type: Number, required: true }, // Giá của sản phẩm (đơn giá)
    // Tổng giá trị tồn kho
    totalPrice: { type: Number, required: true },   //lấy số lượng nhân price
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: "inventory",
  }
);
// Tính toán totalPrice trước khi lưu
inventorySchema.pre('save', function (next) {
  this.totalPrice = this.quantityStock * this.price;
  next();
});


module.exports = model("Inventory", inventorySchema);