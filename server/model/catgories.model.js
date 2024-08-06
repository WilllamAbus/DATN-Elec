const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const categorySchema = Schema(
  {
    name: { type: String, required: true },
    pid: { type: String, required: true, default: uuidv4 },
    path: { type: String, required: true },
    imgURL: { type: String, required: true },
    status: { type: String, default: 'active' },
  },
  {
    collection: "categories",
    timestamps: true,
  }
);

module.exports = model("categories", categorySchema);
