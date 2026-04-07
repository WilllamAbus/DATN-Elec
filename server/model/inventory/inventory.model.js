const { Schema, model } = require("mongoose");
const inventorySchema = Schema(
  {
    product_variant: { type: Schema.Types.ObjectId, ref: 'productVariant'},
    productAuction: { type: Schema.Types.ObjectId, ref: 'productAuction' },
    quantityShelf: {type:Number}, // totalQuantity - quantityStock  số lượng này sẽ là số lượng đưa qua product
    quantityStock: {type:Number},
    totalQuantity : {type: Number, required: true}, // số lượng từ inbound
    // Giá mỗi đơn vị sản phẩm
    price: { type: Number, required: true }, // giá từ inbound
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



module.exports = model("Inventory", inventorySchema);