const { Schema, model } = require("mongoose");
const brandsSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    imgURL: { type: String},
    status: { type: String, default: 'active' },


  },
  {
    collection: "brands",
    timestamps: true,
  }
);

module.exports = model("brands", brandsSchema);
