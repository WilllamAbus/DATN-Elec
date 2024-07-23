const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const discountSchema = Schema(
  {
    code: String, 
    discountPercentage:  Number,
    expiryDate:  Date,
    isActive:  Boolean ,
    category: { type: Schema.Types.ObjectId, ref: 'categories', required: true } ,
    conditionActive: String
  },
  {
    collection: "discount",
    timestamps: true,
  }
);

discountSchema.statics.findWithCategory = function (query) {
    return this.find(query).populate('categories').exec();
  };
module.exports = model("discount", discountSchema);
