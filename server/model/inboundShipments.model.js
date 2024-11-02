const { Schema, model } = require("mongoose");
const inboundShipmentSchema = new Schema(
    {
      product_variant_id: { type: Schema.Types.ObjectId, ref: 'productVariant'},
      productAuction: { type: Schema.Types.ObjectId, ref: 'productAuction' },
      inbound_description: {type: String},
      inbound_quantity: { type: Number, required: true }, // Số lượng hàng nhập khẩu
      inbound_price: {type: Number, required: true},
      totalPriceInbound: {type : Number, required: true},
      status: { type: String, default: 'active' }, // Trạng thái của lô hàng (pending, completed, canceled, etc.)
      createdAt: { type: Date, default: Date.now }, // Ngày tạo bản ghi
      updatedAt: { type: Date, default: Date.now }, // Ngày cập nhật bản ghi gần nhất
    },
    {
      collection: 'inbound_shipments',
      timestamps: true
    }
  );
  

  module.exports = model("InboundShipments", inboundShipmentSchema);