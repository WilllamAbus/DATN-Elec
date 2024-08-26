const { Schema, model } = require("mongoose");

const recommendationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Người dùng nhận được gợi ý
    recommendedItems: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "product_v2",
          required: true,
        }, // Mục được gợi ý
        score: { type: Number, required: true }, // Điểm số hoặc độ tin cậy của gợi ý
      },
    ],
    interactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "interaction", default: [] },
    ], // Các tương tác liên quan đến gợi ý
    // Các thẻ liên quan đến gợi ý (nếu cần)
    algorithm: { type: String, default: "collaborative_filtering" }, // Tên hoặc loại thuật toán được sử dụng
    generatedAt: { type: Date, default: Date.now }, // Thời gian tạo gợi ý
    expiresAt: { type: Date }, // Thời gian hết hạn của gợi ý
    stateRecommendation: {
      type: String,
      enum: ["pending", "viewed", "clicked"],
      default: "pending",
    }, // Trạng thái của gợi ý // Điểm số cho mô hình học, bạn có thể thay đổi dựa trên loại tương tác

    modifieon: { type: Date, default: Date.now },

  
    status: { type: String, default: "active" },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "recommendation",
    timestamps: true,
  }
);

module.exports = model("recommendation", recommendationSchema);
