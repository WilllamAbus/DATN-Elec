const { Schema, model } = require("mongoose");
const conditionShopSchema = new Schema(
  {
    nameCondition: { type: String, required: true },
    status: { type: String, default: 'active' },
    disabledAt: { type: Date, default: null },
    createdAt: {
        type: Date,
        default: Date.now 
      },
  },
  {
    collection: "conditionShopping",
    timestamps: true,
  }
);
module.exports = model("conditionShopping",conditionShopSchema);