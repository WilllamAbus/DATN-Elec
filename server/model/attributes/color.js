const mongoose = require('mongoose'); 
const { Schema, model } = require("mongoose");
const slugify = require('slugify');
const { v4: uuidv4 } = require("uuid");
const colorSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }, 
  status: { type: String, default: 'active' },
  sku: { type: String, unique: true, required: true },
  pid: { type: String, required: true, default: uuidv4 },
  slug: { type: String, unique: true },
}, {
  collection: "colors",
  timestamps: true,
});
colorSchema.pre('save', function (next) {
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

colorSchema.pre('findOneAndUpdate', function (next) {
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

const Color = mongoose.models.Color || model("Color", colorSchema);
module.exports = Color;
