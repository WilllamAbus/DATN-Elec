const { Schema, model } = require("mongoose");
const slugify = require('slugify');
const productVariantSchema = new Schema({
  variant_name: { type: String, required: true }, 
  variant_description: { type: String }, 
  variant_price: { type: Number, required: true },
  variant_attributes: [{
    k: { type: String, required: true }, 
    v: { type: String, required: true }, 
  }],
  image: { type: [String], required: true },
  sku: { type: String, unique: true }, 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  product: { type: Schema.Types.ObjectId, ref: 'product_v2', required: true },
  inventory: [{ type: Schema.Types.ObjectId, ref: 'inventory' }] 
}, {
  collection: "productvariants",
  timestamps: true
});

productVariantSchema.pre('save', function(next) {
  if (this.isModified('variant_name')) {
    this.sku = slugify(this.variant_name, { lower: true, strict: true });
  }
  next();
});

module.exports = model("productVariant", productVariantSchema);
