const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const screenSchema = new Schema({
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'disabled',], 
    default: 'active' 
  },
  sku: { type: String, unique: true, required: true },
  pid: { type: String, required: true, default: uuidv4 },
  slug: { type: String, unique: true },
  description: { type: String },
  deletedAt: { type: Date, default: null },
}, {
  collection: "screens",
  timestamps: true,
});
const generateSlug = (name) => {
  return name
    .replace(/\./g, '-') 
    .replace(/[^a-zA-Z0-9\s-]/g, '') 
    .trim() 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    .replace(/-$/, '');  
};

screenSchema.pre('save', function (next) {
  this.slug = generateSlug(this.name);
  next();
});
screenSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = generateSlug(update.name);
    this.setUpdate(update);
  }
  next();
});

module.exports = model("Screen", screenSchema);
