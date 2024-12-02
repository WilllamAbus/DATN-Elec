const { Schema, model } = require("mongoose");

const customerServiceSchema = Schema(
  {
    bidding: { type: Schema.Types.ObjectId, ref: 'bidding', default:null },
    order: { type: Schema.Types.ObjectId, ref: 'orderDetailAuction', default:null },
    serviceRequest: { type: Schema.Types.ObjectId, ref: 'services', required: true }, // Reference to the specific service
    reason: { type: String }, 
    status: { 
      type: String, 
      enum: ['Mở', 'Đang xử lý', 'Giải pháp', 'Đóng'], 
      default: 'Mở' 
 
    }, // Status of the service request
    assignedAgent: { type: Schema.Types.ObjectId, ref: 'users', required: false }, // Reference to the customer service agent handling the request
    priority: { 
      type: String, 
      enum: ['Thấp', 'Tham chiếu', 'Cao'], 
      default: 'Tham chiếu' 
    }, // Priority level of the service request
    resolutionDetails: { type: String, default: 'none' }, // Details about how the issue was resolved
    notes: { type: String, default: '' }, // Additional notes related to the service request
    modifieon: { type: Date, default: Date.now }, // Ngày cập nhật giỏ hàng
    stateNotifi: { type: String, default: 'has' },

    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
   
  // Add this field
  },
  {
    collection: "customerService",
    timestamps: true,
  }
);

module.exports = model("customerService", customerServiceSchema);
