const { Schema, model } = require("mongoose");

const interactionSchema = new Schema(
  {

    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    item: { type: Schema.Types.ObjectId, ref: 'product_v2', required: true },
    type: {
      type: String,
      enum: ['view', 'comment', 'rating', 'add wishlist', 'purchase'], // Các loại tương tác
      required: true
    },
    score: { type: Number, default: 1 }, // Điểm số cho mô hình học, bạn có thể thay đổi dựa trên loại tương tác
   
    modifieon: { type: Date, default: Date.now },
  
    isActive: { type: Boolean, default: true },

    disabledAt: { type: Date, default: null },

  },
  {
    collection : "interaction",
    timestamps:true
  }
 
);



module.exports = model("interaction", interactionSchema);