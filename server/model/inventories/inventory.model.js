const { Schema, model } = require("mongoose");

const inventorySchema = Schema(
  {
    product: { 
      type: Schema.Types.ObjectId, 
      ref: "product_v2",
      required: function() { return !this.variant; } // Nếu không có variant, product là bắt buộc
    },
    variant: { 
      type: Schema.Types.ObjectId, 
      ref: "productVariant",
      required: function() { return !this.product; } // Nếu không có product, variant là bắt buộc
    },
    quantityShelf: {type:Number}, // totalQuantity - quantityStock  số lượng này sẽ là số lượng đưa qua product
    quantityStock: {type:Number},
    totalQuantity : {type: Number, required: true}, // số lượng từ inbound
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
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

// Trước khi lưu trữ hoặc cập nhật tài liệu
inventorySchema.pre("save", function (next) {
  if (this.quantity < 0) {
    return next(new Error("Quantity cannot be negative."));
  }
  next();
});
module.exports = model("inventory", inventorySchema);