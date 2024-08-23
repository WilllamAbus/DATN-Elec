const { Schema, model } = require("mongoose");
const suppliersSchema = Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    image: {type : String},
    description: { type: String },
    status: { type: String, default: "active" },
  },
  {
    collection: "suppliers",
    timestamps: true,
  }
);

module.exports = model("Supplier", suppliersSchema);
