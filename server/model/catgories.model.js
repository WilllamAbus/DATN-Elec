const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const categorySchema = Schema(
  {
    name: { type: String, required: true },
    status: { type: String, default: 'active' },
    pid: { type: String, required: true, default: uuidv4 },
    path: { type: String, required: true },
    imgURL: { type: String, required: true },
   
  // Add this field
  },
  {
    collection: "categories",
    timestamps: true,
  }
);

module.exports = model("Category", categorySchema);
