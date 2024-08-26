const { Schema, model } = require("mongoose");
const brandsSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    status: { type: String, default: 'active' },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    supplier_id: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },

  },
  {
    collection: "brands",
    timestamps: true,
  }
);

module.exports = model("Brand", brandsSchema);
