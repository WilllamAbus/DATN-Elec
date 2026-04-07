const { Schema, model } = require("mongoose");
const slugify = require('slugify');
const { v4: uuidv4 } = require("uuid");
const removeAccents = require('remove-accents');

const productV2Schema = new Schema({
  product_name: { type: String, required: true },
  image: { type: [String], required: true },
  product_description: { type: String, required: true },
  sku: { type: String, unique: true, required: true },
  pid: { type: String, required: true, default: uuidv4 },
  product_type: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  product_brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  product_condition: { type: Schema.Types.ObjectId, ref: 'conditionShopping', required: true },
  product_supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  product_ratingAvg: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be below 5']
  },
  product_view: { type: Number, default: 0 },
  weight_g: { type: Number, required: true },
  status: { type: String, default: 'disable' },
  disabledAt: { type: Date, default: null },
  variants: [{ type: Schema.Types.ObjectId, ref: 'productVariant' }],
  hasVariants: { type: Boolean, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  posts: { type: Schema.Types.ObjectId, ref: 'Post' },
  slug: { type: String, unique: true, sparse: true },
  normalized_name:  { type: String, unique: true, sparse: true }, //thêm cái này để tìm kiếm ko dấu
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
//thêm cái này để tìm kiếm ko dấu
productV2Schema.pre('save', function (next) {
  const productName = this.product_name || '';
  this.normalized_name = removeAccents(productName).toLowerCase().replace(/\s+/g, ' ');
  next();
});

module.exports = model("product_v2", productV2Schema);
