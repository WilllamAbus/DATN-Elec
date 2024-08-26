const { Schema, model } = require("mongoose");

const resversationSchema = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Người dùng đã thực hiện đặt chỗ
        product: { type: Schema.Types.ObjectId, ref: 'product_v2', required: true }, // Sản phẩm được đặt chỗ
        quantity: { type: Number, required: true }, // Số lượng sản phẩm đã đặt
        reservationDate: { type: Date, default: Date.now }, // Ngày đặt chỗ
        status: { 
          type: String, 
          enum: ['Xử lý', 'Xác nhận', 'Hủy bỏ'], // Trạng thái của đặt chỗ
          default: 'Xử lý' 
        },
        stateNotifi: { type: String, default: 'has' },
        isActive: { type: Boolean, default: true },
        status: { type: String, default: 'active' },
        disabledAt: { type: Date, default: null },
   
      },
      {
        collection:"resversation",
      timestamps: true,
      }
);

module.exports = model("resversation", resversationSchema);