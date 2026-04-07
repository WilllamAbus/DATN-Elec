const { Schema, model } = require("mongoose");
 // Import formatShoppingSchema từ mô hình của bạn

const priceRangeBidSchema = new Schema(
 
    {
        product_randBib: {
          productId: { type: Schema.Types.ObjectId, ref: 'productAuction' }, 
            product_price_unit: { type: Number },
            product_name:{type: String}, 
        
        
          },

          
          minBid: { type: Number,  },
          midBid: { type: Number,},
          maxBid: { type: Number, },
          bidInput:  { type: Number,  },
      createdAt: { type: Date, default: Date.now },
 
      status: { type: String, default: "active" },
      disabledAt: { type: Date, default: null }, // Disabled date if applicable
    },

  {
    collection: "priceRangeBid",
    timestamps: true,
  }
);



module.exports = model("priceRangeBid", priceRangeBidSchema);