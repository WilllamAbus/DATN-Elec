const { Schema, model } = require("mongoose");

const orderDetailAuctionSchema = new Schema(
  {
  
    order: { type: Schema.Types.ObjectId, ref: "orderAuctions"},
    auction: { type: Schema.Types.ObjectId, ref: "auctions" },
    productID: { type: Schema.Types.ObjectId, ref: 'inventory', required: true },
    nameProduct:{type:String},
    quantityDetails:{ type: Number,  require:true },
    totalAmount: { type: Number, required: true }, 
    shippingFee: { type: Number, default: 31000 }, 
    totalPriceWithShipping: { type: Number, required: true },
   
        // Số tiền thanh toán
        payment_date: { type: Date, default: Date.now }, // Ngày thanh toán, mặc định là ngày hiện tại
        payment_method: {
          type: String,
          enum: ["Thanh toán MoMo", "Thanh toán trực tiếp", "Thanh toán VnPay"], // Chỉ định các giá trị hợp lệ cho payment_method
        
        },
        // Shipping details as embedded object
        formatShipping: {
          type: {
            type: String,
            enum: ["Tiêu chuẩn"], // Example shipping types
          
          },
        },
       
     hashLinkPayment: { type: String, required: true },
     
    stateOrderDetails :{
        type:String,
        enum:['Tiến hành thanh toán', 'Xác nhận'],
     
      },
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null }, // Disabled date if applicable
  },

  {
    collection: "orderDetailAuction",
    timestamps: true,
  }
);

module.exports = model("orderDetailAuction", orderDetailAuctionSchema);
