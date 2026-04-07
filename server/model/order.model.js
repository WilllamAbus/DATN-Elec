// src/models/order.model.js
const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    payment: {
      method: { type: String, required: true },
      details: { type: Object, default: {} },
      // To store additional payment details if needed
    },
    quantityShopping: Number,
    totalPrice: { type: Number },
    userId: [
      {
        user: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Reference to User model
        email: { type: String, required: true },
      },
    ],
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "product_v2" }, // Reference to Product model
        name: { type: String, required: true },
      },
    ],
    shipping: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      sdt: { type: String, required: true },
      formatShipping: {
        type: {
          type: String,
          enum: ["standard", "express"], // Ensure these values match your enum
          required: true,
        },
        price: Number,
      },
    },
    status: { type: String, default: "active" },
  },
  {
    collection: "order",
    timestamps: true,
  }
);

module.exports = model("Order", orderSchema);
