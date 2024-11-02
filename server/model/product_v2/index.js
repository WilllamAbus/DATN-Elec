const { Schema, model } = require("mongoose");
const slugify = require('slugify');
const { v4: uuidv4 } = require("uuid");


const productV2Schema = new Schema({
  product_name: { type: String, required: true },
  image: { type: [String], required: true },
  product_description: { type: String, required: true },
  sku: { type: String, unique: true, required: true },
  pid: { type: String, required: true, default: uuidv4 },
  product_type: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  product_discount: {
    discountId: { type: Schema.Types.ObjectId, ref: 'discounts' },
    code: { type: String },
    discountPercent: { type: Number },
    isActive: { type: Boolean },
    status: { type: String },
    disabledAt: { type: Date }
  },
  hasVariants: { type: String, default: "false" },
  product_brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  product_format: { type: Schema.Types.ObjectId, ref: 'formatShopping', required: true },
  product_condition: { type: Schema.Types.ObjectId, ref: 'conditionShopping', required: true },
  product_supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  product_ratingAvg: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be below 5']
  },

  product_view: { type: Number, default: 0 },
  product_price: { type: Number, required: true },
  product_price_unit: { type: Number, required: true },
  product_color: { type: String, },
  weight_g: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  status: { type: String, default: 'disable' },
  disabledAt: { type: Date, default: null },
  variants: [{ type: Schema.Types.ObjectId, ref: 'productVariant' }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  product_attributes: [{
    k: { type: String, required: true },
    v: { type: Schema.Types.Mixed, required: true },
    u: { type: String }
  }],
  slug: { type: String, unique: true, sparse: true },
}, {
  collection: "product_v2",
  timestamps: true
});


productV2Schema.pre('save', function (next) {
  const options = {
    lower: true,
    replacement: '-',
    strict: true,
    locale: 'vi',
    customReplacements: { 'Đ': 'd', 'đ': 'd' }
  };

  this.slug = slugify(this.product_name, options);
  next();
});

productV2Schema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name) {
    const options = {
      lower: true,
      replacement: '-',
      strict: true,
      locale: 'vi',
      customReplacements: { 'Đ': 'd', 'đ': 'd' }
    };
    update.slug = slugify(update.product_name, options);
    this.setUpdate(update);
  }
  next();
});

module.exports = model("product_v2", productV2Schema);
