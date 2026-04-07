// const { Schema, model } = require("mongoose");
// const slugify = require("slugify");
// const productV2Schema = new Schema(
//   {
//     product_name: { type: String, required: true },
//     product_imgage: { type: [String], required: true },
//     product_description: { type: String, required: true },
//     product_slug: String,
//     product_type: {
//       type: Schema.Types.ObjectId,
//       ref: "categories",
//     },
//     product_discount: { type: Schema.Types.ObjectId, ref: "discounts" },
//     product_brand: { type: Schema.Types.ObjectId, ref: "brands" },
//     product_format: { type: Schema.Types.ObjectId, ref: "formatShopping" },
//     product_condition: {
//       type: Schema.Types.ObjectId,
//       ref: "conditionShopping",
//     },
//     product_quantity: { type: Number, require: true },
//     product_ratingAvg: {
//       type: Number,
//       default: 4.5,
//       min: [1, "Rating must be above 1"],
//       max: [5, "Rating must be above 5"],
//     },
//     product_view: {
//       type: Number,
//       default: 0,
//     },
//     product_price: { type: Number, require: true },
//     product_attributes: {
//       type: Schema.Types.Mixed,
//       require: true,
//       default: {},
//     },
//     isActive: { type: Boolean, default: true },
//     status: { type: String, default: "active" },
//     disabledAt: { type: Date, default: null },
//   },
//   {
//     collection: "product_v2",
//     timestamps: true,
//   }
// );

// productV2Schema.pre("save", function (next) {
//   this.product_slug = slugify(this.product_name, { lower: true });
//   next();
// });

// module.exports = model("product_v2.", productV2Schema);
