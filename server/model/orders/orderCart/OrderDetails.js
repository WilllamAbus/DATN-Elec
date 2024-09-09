const { Schema, model } = require("mongoose");
const orderItem = require("./orderItem");

const orderDetailSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "OrderCart", required: true },
    items: [orderItem],
  },
  {
    collection: "OrderDetail",
    timestamps: true,
  }
);

module.exports = model("OrderDetail", orderDetailSchema);
