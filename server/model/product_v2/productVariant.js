const { Schema, model } = require("mongoose");
const slugify = require('slugify');
const { v4: uuidv4 } = require("uuid");
const productVariantSchema = new Schema({
  variant_name: { type: String}, 
  variant_description: { type: String }, 
  variant_price: { type: Number },
  battery: { type: Schema.Types.ObjectId, ref: 'Battery' },
  color: { type: Schema.Types.ObjectId, ref: 'Color' },
  cpu: { type: Schema.Types.ObjectId, ref: 'Cpu' },
  graphicsCard: { type: Schema.Types.ObjectId, ref: 'GraphicsCard' },
  operatingSystem: { type: Schema.Types.ObjectId, ref: 'OperatingSystem' },
  ram: { type: Schema.Types.ObjectId, ref: 'Ram' },
  screen: { type: Schema.Types.ObjectId, ref: 'Screen' },
  storage: { type: Schema.Types.ObjectId, ref: 'Storage' },
  image: { type: [String], required: true },
  slug: { type: String, unique: true },
  sku: { type: String, unique: true, required: true },
  pid: { type: String, required: true, default: uuidv4 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  product: { type: Schema.Types.ObjectId, ref: 'product_v2', required: true },
  inventory: [{ type: Schema.Types.ObjectId, ref: 'Inventory' }],
}, {
  collection: "productvariants",
  timestamps: true
});

productVariantSchema.pre('save', function(next) {
  const options = {
    lower: true,
    replacement: '-',
    strict: true,
    locale: 'vi',
    customReplacements: { 'Đ': 'd', 'đ': 'd' }
  };

  this.slug = slugify(this.variant_name, options);
  next();
});

productVariantSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.variant_name) {
    const options = {
      lower: true,
      replacement: '-',
      strict: true,
      locale: 'vi',
      customReplacements: { 'Đ': 'd', 'đ': 'd' }
    };
    update.slug = slugify(update.variant_name, options);
    this.setUpdate(update);
  }
  next();
});


module.exports = model("productVariant", productVariantSchema);
