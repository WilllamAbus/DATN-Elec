const { Schema, model } = require("mongoose");
const slugify = require('slugify');
const { v4: uuidv4 } = require("uuid");
const categoryPostSchema = new Schema({
  name: { type: String, required: true},
  slug: { type: String, unique: true, sparse: true }, 
  sku: { type: String, unique: true, required: true },
  pid: { type: String, required: true, default: uuidv4 },
  image: { type: [String], required: true },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
}, {
  collection: "category_posts",  
  timestamps: true
});


categoryPostSchema.pre('save', function (next) {
  const options = {
    lower: true,
    replacement: '-',
    strict: true,
    locale: 'vi',
    customReplacements: { 'Đ': 'd', 'đ': 'd' }
  };

  this.slug = slugify(this.name, options);  
  next();
});


categoryPostSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name) {
    const options = {
      lower: true,
      replacement: '-',
      strict: true,
      locale: 'vi',
      customReplacements: { 'Đ': 'd', 'đ': 'd' }
    };
    update.slug = slugify(update.name, options);  
    this.setUpdate(update);
  }
  next();
});

module.exports = model("CategoryPost", categoryPostSchema);
