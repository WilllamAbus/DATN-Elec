const { Schema, model } = require("mongoose");

const inventoryOutSchema = Schema(
  {
    inventory: [{ type: Schema.Types.ObjectId, ref: 'inventory', required: true }], // Reference to the Inventory document
    quantitySheftOut: { type: Number, required: true }, // Quantity of the product taken out of inventory
    reason: { type: String, enum: ['trade', 'return', 'other'] }, // Reason for inventory out
    quantityStockOut: { type: Number, required: true },
    totalQuantityOut: { type: Number, required: true },
    salePrice: { type: Number, required: true}, 
    saleValue: { type: Number, require:true }, 
    
    remainingQuantitySheft: { type: Number, require:true }, // Remaining quantity in inventory after the sale
    remainingquantityStockOut: { type: Number, require:true }, // Remaining quantity in inventory after the sale
    remainingtotalQuantityOut: { type: Number, require:true }, // Remaining quantity in inventory after the sale
    remainingValue: { type: Number, require:true  }, // Value of the remaining inventory
     remainingsalePrice: { type: Number,},
    isActive: { type: Boolean, default: true }, // Active status flag
    status: { type: String, default: 'active' }, // Record status
    disabledAt: { type: Date, default: null }, // Date when the record was disabled
    createdAt: { type: Date, default: Date.now }, // Record creation date
    updatedAt: { type: Date, default: Date.now }, // Last update date
  },
  {
    collection: "inventory_out",
    timestamp:true
  }
);

// Trước khi lưu trữ hoặc cập nhật tài liệu

module.exports = model("inventory_out", inventoryOutSchema);