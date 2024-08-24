const { Schema, model } = require("mongoose");




const formatShoppingSchema = new Schema(
  {
   
    formats: { type: String, required: true },
    status: { type: String, default: 'active' },
    disabledAt: { type: Date, default: null },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to the current date and time
      },
  },
  {
    collection: "formatShopping",
    timestamps: true,
  }
);


module.exports = model("formatShopping",formatShoppingSchema);
