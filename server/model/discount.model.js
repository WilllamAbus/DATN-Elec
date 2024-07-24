const { Schema, model } = require("mongoose");

const discountSchema = new Schema(
  {
    code: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    cateReady: [
      {
        category: { type: Schema.Types.ObjectId, ref: 'categories' }, // Reference to Category model
        name: { type: String, required: true }
      }
    ],
    expiryDate: { type: Date, required: true },
    conditionActive: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  {
    collection: "discount", // Name of the collection
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

discountSchema.statics.findWithCategory = function (query) {
  return this.find(query).populate('cateReady.category').exec();
};

module.exports = model("Discount", discountSchema);


