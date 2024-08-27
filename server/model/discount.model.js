const { Schema, model } = require("mongoose");

const discountSchema = new Schema(
  {
    code: { type: String, required: true },
    discountPercent: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: 'active' },
    disabledAt: { type: Date, default: null },
  },
  {
    collection:'discounts',
    timestamps:true
  }
 
);



module.exports = model("discounts", discountSchema);