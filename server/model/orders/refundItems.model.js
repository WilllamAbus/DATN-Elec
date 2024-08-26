const { Schema, model } = require("mongoose");

const refundItemsSchema = new Schema({
  billingId: { type: Schema.Types.ObjectId, ref: "billings", required: true }, // Reference to Billing
  reason: { type: String, required: true }, // Reason for refund
  date: { type: Date, default: Date.now }, // Date of refund request
  stateRefund: { type: String, enum: ["Xử lý", "Hoàn thành", "Hủy bỏ"] ,require:true}, // Refund status
  
  // New fields
  deliveryOption: {
    type: String,
      default: "Tiêu chuẩn"
     // Example delivery options
  
  },
  refundChoice: {
    type: String,
   // Example refund choices
    default: "Hoàn trả đầy đủ", // Default value
  },
  createdAt: { type: Date, default: Date.now },

  status: { type: String, default: "active" },
  disabledAt: { type: Date, default: null }
}, {
  collection: "refundItems",
  timestamps: true,
});

module.exports = model("refundItems", refundItemsSchema);
