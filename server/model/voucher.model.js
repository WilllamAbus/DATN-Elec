const { Schema, model } = require("mongoose");

const voucherSchema = new Schema(
  {
    code: { type: String, required: true },
    voucherNum: { type: Number, required: true },
    cateReady: [
      {
        category: { type: Schema.Types.ObjectId, ref: 'Category' }, // Reference to Category model
        name: { type: String, required: true }
      }
    ],
    expiryDate: { 
      type: Date, 
      required: true
    
    
    },
    conditionActive: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: 'active' },
  
  },
  {
    collection: "voucher", // Name of the collection
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

voucherSchema.statics.findWithCategory = function (query) {
  return this.find(query).populate('cateReady.category').exec();
};

module.exports = model("Voucher", voucherSchema);


