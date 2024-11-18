const { Schema, model } = require("mongoose");
const Color = require('../attributes/color'); 

const imageVariantSchema = new Schema({
  image: [{ type: String, required: true }],
  productVariant: { type: Schema.Types.ObjectId, ref: 'productVariant', required: true },
  color: { type: Schema.Types.ObjectId, ref: 'Color' },
  price: { type: Number, required: true, default: 0 },
  slug: { type: String, unique: true }, 
}, {
  collection: "imagevariants",
  timestamps: true
});


imageVariantSchema.pre('save', async function(next) {
  if (this.color) {
    try {
      const colorDoc = await Color.findById(this.color).select('slug'); 
      if (colorDoc) {
        this.slug = colorDoc.slug; 
      }
    } catch (error) {
      return next(error); 
    }
  }
  next(); 
});

module.exports = model("ImageVariant", imageVariantSchema);
