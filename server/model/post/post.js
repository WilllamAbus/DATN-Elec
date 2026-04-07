const { Schema, model } = require("mongoose");
const slugify = require('slugify');
const { v4: uuidv4 } = require("uuid");
const postSchema = new Schema({
  title: { type: String, required: true },                
  slug: { type: String, unique: true, sparse: true },     
  content: { type: String, required: true },                           
  product: { type: Schema.Types.ObjectId, ref: 'product_v2', required: true }, 
  thumbnail: { type: [String], required: true },               
  category: { type: Schema.Types.ObjectId, ref: 'CategoryPost', required: true },
  status: {
    type: String,
    enum: ['draft', 'active', 'disabled'], 
    default: 'active', 
  },
  sku: { type: String, unique: true, required: true },
  pid: { type: String, required: true, default: uuidv4 },
}, {
  collection: "posts",
  timestamps: true
});

postSchema.pre('save', function (next) {
  const options = {
    lower: true,
    replacement: '-',
    strict: true,
    locale: 'vi',
    customReplacements: { 'Đ': 'd', 'đ': 'd' }
  };

  this.slug = slugify(this.title, options);
  next();
});

postSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name) {
    const options = {
      lower: true,
      replacement: '-',
      strict: true,
      locale: 'vi',
      customReplacements: { 'Đ': 'd', 'đ': 'd' }
    };
    update.slug = slugify(update.title, options);
    this.setUpdate(update);
  }
  next();
});

module.exports = model("Post", postSchema);
