const { Schema, model } = require("mongoose");

const orderDetailsSchema = new Schema(
  {
  
    order: { type: Schema.Types.ObjectId, ref: "orders", required: true },
    product: { type: Schema.Types.ObjectId, ref: "product_v2", required: true },

    totalAmount: { type: Number, required: true }, 
    shippingFee: { type: Number, default: 31000 }, 
    totalPriceWithShipping: { type: Number, required: true },
    order_date: { type: Date, default: Date.now }, // Order date
    createdAt: { type: Date, default: Date.now },

    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null }, // Disabled date if applicable
  },

  {
    collection: "orderDetails",
    timestamps: true,
  }
);

module.exports = model("orderDetails", orderDetailsSchema);
