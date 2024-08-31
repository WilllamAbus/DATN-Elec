const { Schema, model } = require("mongoose");
const inboundShipmentSchema = new Schema(
    {
      product_id: { type: Schema.Types.ObjectId, ref: 'product_v2', required: true }, // Tham chiếu đến sản phẩm
      inbound_description: {type: String},
      inbound_quantity: { type: Number, required: true }, // Số lượng hàng nhập khẩu
      inbound_price: {type: Number},
      inbound_supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true }, // Tham chiếu đến nhà cung cấp
      status: { type: String, default: 'pending' }, // Trạng thái của lô hàng (pending, completed, canceled, etc.)
      createdAt: { type: Date, default: Date.now }, // Ngày tạo bản ghi
      updatedAt: { type: Date, default: Date.now }, // Ngày cập nhật bản ghi gần nhất
    },
    {
      collection: 'inbound_shipments',
      timestamps: true
    }
  );
  

  module.exports = model("InboundShipments", inboundShipmentSchema);