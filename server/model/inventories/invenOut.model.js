const { Schema, model } = require("mongoose");

const inventoryOutSchema = Schema(
  {
    inventory: { type: Schema.Types.ObjectId, ref: 'inventory', required: true }, // Reference to the Inventory document
    quantityOut: { type: Number, required: true }, // Quantity of the product taken out of inventory
    reason: { type: String, enum: ['trade', 'return', 'other'], default: 'other' }, // Reason for inventory out
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Reference to the user who performed the action
    dateOut: { type: Date, default: Date.now }, // Date when the inventory out action was performed
    notes: { type: String, default: '' }, // Optional notes for additional information

    auctionQuantity: { type: Number, default: 0 }, // Quantity of the product sold through auction
    saleQuantity: { type: Number, default: 0 }, // Quantity of the product sold
    salePrice: { type: Number, default: 0 }, // Price at which the product was sold
    saleValue: { type: Number, require:true }, // Value of the product sold (quantity * price)
    
    remainingQuantity: { type: Number, require:true }, // Remaining quantity in inventory after the sale
    remainingValue: { type: Number, require:true  }, // Value of the remaining inventory
    
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
