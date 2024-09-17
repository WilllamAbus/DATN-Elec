const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("../../product-v2.model");
const orderDetailSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "OrderCart", required: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product_v2",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        // totalItemPrice: { type: Number, required: true },
      },
    ],
    // quantity: { type: Number, required: true },
    // price: { type: Number, required: true },
    totalItemPrice: { type: Number, required: true },
  },
  {
    collection: "OrderDetail",
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderDetail", orderDetailSchema);
