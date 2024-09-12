// models/orderItemSchema.js
const { Schema } = require("mongoose");

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "product_v2", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalItemPrice: { type: Number, required: true },
});

module.exports = orderItemSchema;
