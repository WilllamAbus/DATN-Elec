const { Schema, model } = require("mongoose");

const notificationSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Reference to the user receiving the notification
    message: { type: String, required: true }, // The content of the notification
    type: { 
      type: String, 
      enum: ['Thông tin'], // Types of notifications
     
    }, // Type of notification
   
    orders: { type: Schema.Types.ObjectId, ref: 'orderDetailAuction'  ,  default:null},
    customer_service: { type: Schema.Types.ObjectId, ref: 'customerService',  default:null },
    // resversation: { type: Schema.Types.ObjectId, ref: 'resversation',  default:{} },
    isRead: { type: Boolean, default: false }, // Whether the notification has been read

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