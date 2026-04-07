const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const productAuctionSchema = new Schema(
  {
    product_name: { type: String, required: true },
    image: { type: [String], required: true },
    product_description: { type: String, required: true },
    slug: { type: String, unique: true },
    product_price: { type: Number },
    product_type: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    product_brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    product_condition: {
      type: Schema.Types.ObjectId,
      ref: "conditionShopping",
      required: true,
    },
    product_supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    auctionPricing: { type: Schema.Types.ObjectId, ref: "AuctionPricingRange" },
    auctionRound: { type: Schema.Types.ObjectId, ref: "AuctionRound" },
    inventory: [{ type: Schema.Types.ObjectId, ref: "Inventory" }],
    viewCount: { type: Number, default: 0 },
    lastViewed: { type: Date, default: Date.now },
    weight_g: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "productAuction",
    timestamps: true,
  }
);

productAuctionSchema.pre("save", function (next) {
  const options = {
    lower: true,
    replacement: "-",
    strict: true,
    locale: "vi",
    customReplacements: { Đ: "d", đ: "d" },
  };

  this.slug = slugify(this.product_name, options);
  next();
});

productAuctionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    const options = {
      lower: true,
      replacement: "-",
      strict: true,
      locale: "vi",
      customReplacements: { Đ: "d", đ: "d" },
    };
    update.slug = slugify(update.product_name, options);
    this.setUpdate(update);
  }
  next();
});

module.exports = model("productAuction", productAuctionSchema);
