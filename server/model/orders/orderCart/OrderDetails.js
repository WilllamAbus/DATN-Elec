const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "OrderCart", required: true }, // Liên kết tới OrderCart
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product_v2",
          required: true,
        },
        productVariant: {
          type: Schema.Types.ObjectId,
          ref: "productVariant",
          required: true,
        },
        inventory: {
          type: Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },

        // Số lượng và giá từng sản phẩm
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalItemPrice: { type: Number, required: true }, // Tổng giá cho từng sản phẩm (quantity * price)
      },
    ],
    itemAuction: [
      {
        product_randBib: {
          type: Schema.Types.ObjectId,
          ref: "productAuction",
          required: true,
        },
        auctionWinner: {
          type: Schema.Types.ObjectId,
          ref: "AuctionWinner",
        },
        inventory: {
          type: Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },

        // Số lượng và giá từng sản phẩm
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalItemPrice: { type: Number, required: true }, // Tổng giá cho từng sản phẩm (quantity * price)
      },
    ],
    // Tổng giá của tất cả các sản phẩm trong đơn hàng
    totalItemPrice: { type: Number, required: true },
  },
  {
    collection: "OrderDetail",
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderDetail", orderDetailSchema);
