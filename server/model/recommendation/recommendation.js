const { Schema, model } = require("mongoose");

// Định nghĩa schema cho recommendation
const recommendationSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "users", 
      required: true 
    },
    recommendedItems: [
      {
        item: {
          type: Schema.Types.ObjectId,
          required: true, 
          refPath: 'recommendedItems.itemType', 
        },
        itemType: {
          type: String,
          required: true,
          enum: ["productvariants", "productAuction"], 
        },
        score: { 
          type: Number, 
          required: true, 
        },
      },
    ],
    interactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "interaction", 
        default: [], 
      },
    ],
    algorithm: { 
      type: String, 
      default: "collaborative_filtering" 
    },
    generatedAt: { 
      type: Date, 
      default: Date.now  
    },
    expiresAt: { 
      type: Date, 
      default: null 
    },
    stateRecommendation: {
      type: String,
      enum: ["pending", "viewed", "clicked"],
      default: "pending", 
    },
    status: { 
      type: String, 
      default: "active" 
    },
    disabledAt: { 
      type: Date, 
      default: null 
    },
    modifiedOn: { 
      type: Date, 
      default: Date.now 
    },
  },
  {
    collection: "recommendation", 
    timestamps: true, 
  }
);

// Export mô hình recommendation
module.exports = model("Recommendation", recommendationSchema);
