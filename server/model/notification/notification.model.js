const { Schema, model } = require("mongoose");

const notificationSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Reference to the user receiving the notification
    message: { type: String, required: true }, // The content of the notification
    type: { 
      type: String, 
      enum: ['Thông tin', 'Cảnh báo', 'Lỗi', 'Thành công'], // Types of notifications
      default: 'Thông tin' 
    }, // Type of notification
    auction: { type: Schema.Types.ObjectId, ref: 'auctions',  default:{} },
    orders: { type: Schema.Types.ObjectId, ref: 'orders',  default:{} },
    customer_service: { type: Schema.Types.ObjectId, ref: 'customerService',  default:{} },
    resversation: { type: Schema.Types.ObjectId, ref: 'resversation',  default:{} },
    isRead: { type: Boolean, default: false }, // Whether the notification has been read
  // Optional URL or path to the image associated with the notification
  // Additional notes related to the service request
    modifieon: { type: Date, default: Date.now }, 
    stateNotifi: { type: String, default: 'has' },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
   
  // Add this field
  },
  {
    collection: "notification",
    timestamps: true,
  }
);

module.exports = model("notification", notificationSchema);