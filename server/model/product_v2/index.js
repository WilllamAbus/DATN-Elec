const { Schema, model } = require("mongoose");
const slugify = require('slugify');

const productV2Schema = new Schema({
  product_name: { type: String, required: true },
  image: { type: [String], required: true },
  product_description: { type: String, required: true },
  product_slug: { type: String, unique: true }, 
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
  product_attributes: [{
    k: { type: String, required: true },
    v: { type: Schema.Types.Mixed, required: true }, 
    u: { type: String }
  }],
  product_color: { type: String,},
  weight_g: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  status: { type: String, default: 'active' },
  disabledAt: { type: Date, default: null },
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  variants: [{ type: Schema.Types.ObjectId, ref: 'productVariant' }] 
}, {
  collection: "product_v2",
  timestamps: true
});

productV2Schema.pre('save', function(next){
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

module.exports = model("product_v2", productV2Schema);
