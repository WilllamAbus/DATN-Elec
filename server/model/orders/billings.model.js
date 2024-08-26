

const { Schema, model } = require("mongoose");


const billingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Reference to user
  cartDetails: [{ type: Schema.Types.ObjectId, ref: "orderCarts", default: [] }], // Reference to orderCarts
  auctionDetails: [{ type: Schema.Types.ObjectId, ref: "orderAuctions", default: [] }], // Reference to orderAuctions

  // Use Schema.Types.Mixed for flexible field types
  paymentId: { type: Schema.Types.Mixed, required: true }, // Payment ID
  shippingAddressId: { type: Schema.Types.Mixed, required: true }, // Shipping Address ID
  voucherIds: [{ type: Schema.Types.Mixed, default: [] }], // Array of voucher IDs

  formatShipping: {
    type: {
      type: String,
      enum: ["Tiêu chuẩn"], // Example shipping types
      required: true,
    },
  
  },

  totalAmount: { type: Number, required: true }, // Total amount before shipping
  shippingFee: { type: Number, default: 31000 }, // Shipping fee
  totalPriceWithShipping: { type: Number, required: true }, // Total price including shipping

  stateBilling: {
    type: String,
    enum: ["Giao hàng", "Hoàn trả", "Hủy bỏ"], // Updated order status
    default: "Giao hàng", // Default value
    required: true,
  },
  order_date: { type: Date, default: Date.now }, // Order date
  createdAt: { type: Date, default: Date.now },

  status: { type: String, default: "active" },
  disabledAt: { type: Date, default: null }, // Disabled date if applicable
}, {
  collection: "billings",
  timestamps: true,
});

// // Pre-save hook to calculate totals, apply discounts, and set references
// billingSchema.pre('save', async function (next) {
//   try {
//     let totalAmount = 0;

//     // Calculate total amount from referenced orderCarts
//     if (this.cartDetails && this.cartDetails.length > 0) {
//       const orderCarts = await model("orderCarts").find({ _id: { $in: this.cartDetails } }).select('totalAmount');
//       totalAmount = orderCarts.reduce((sum, cart) => sum + cart.totalAmount, 0);
//     }

//     // Calculate total amount from referenced orderAuctions
//     if (this.auctionDetails && this.auctionDetails.length > 0) {
//       const orderAuctions = await model("orderAuctions").find({ _id: { $in: this.auctionDetails } }).select('totalAmount');
//       totalAmount += orderAuctions.reduce((sum, auction) => sum + auction.totalAmount, 0);
//     }

//     // Set total amount and calculate shipping fee and total price with shipping
//     this.totalAmount = totalAmount;
//     this.shippingFee = this.formatShipping.price;
//     this.totalPriceWithShipping = this.totalAmount + this.shippingFee;

//     // Retrieve and set paymentId, shippingAddressId, and voucherIds
//     if (this.cartDetails && this.cartDetails.length > 0) {
//       const orderCarts = await model("orderCarts").find({ _id: { $in: this.cartDetails } });
//       if (orderCarts.length > 0) {
//         this.paymentId = orderCarts[0].paymentId; // Example of setting paymentId
//         this.shippingAddressId = orderCarts[0].shippingAddressId; // Example of setting shippingAddressId
//       }
//     }

//     if (this.auctionDetails && this.auctionDetails.length > 0) {
//       const orderAuctions = await model("orderAuctions").find({ _id: { $in: this.auctionDetails } });
//       if (orderAuctions.length > 0) {
//         this.voucherIds = orderAuctions.map(auction => auction.voucherId); // Example of setting voucherIds
//       }
//     }

//     // Apply voucher discount if applicable
//     if (this.voucherIds && this.voucherIds.length > 0) {
//       const vouchers = await model("vouchers").find({ _id: { $in: this.voucherIds } });
//       this.totalPriceWithShipping -= vouchers.reduce((sum, voucher) => sum + voucher.discountAmount, 0);
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Post-save hook to create an invoice if stateBilling is "Giao hàng"
// billingSchema.post('save', async function (doc, next) {
//   try {
//     if (doc.stateBilling === "Giao hàng") {
//       const Invoice = require("./invoice.model"); // Import your Invoice model

//       const invoiceData = {
//         billingId: doc._id,
//         user: doc.user,
//         totalAmount: doc.totalAmount,
//         totalPriceWithShipping: doc.totalPriceWithShipping,
//         createdAt: doc.createdAt,
//       };

//       // Create an invoice
//       await Invoice.create(invoiceData);
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = model("billing", billingSchema);