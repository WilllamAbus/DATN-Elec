// "use strict";
// const Recommendation = require("../../model/recommendation/recommendation.model"); // Model cho recommendation
// const Product_v2 = require("../../model/product_v2"); // Model cho product
// const Interaction = require("../../model/recommendation/interaction.model"); // Model cho interaction

// const recommendationService = {
//   // Lấy danh sách khuyến nghị
//   getAllRecommendations: async (page = 1, limit = 10) => {
//     try {
//       // Tính toán các thông số phân trang
//       const skip = (page - 1) * limit;
//       const recommendations = await Recommendation.find({ status: "active" })
//         .skip(skip)
//         .limit(limit)
//         .sort({ generatedAt: -1 }) // Sắp xếp theo thời gian gần nhất
//         .exec();

//       const total = await Recommendation.countDocuments({ status: "active" }).exec(); // Tổng số bản ghi

//       return {
//         total,
//         page,
//         limit,
//         recommendations,
//       };
//     } catch (error) {
//       throw new Error(`Error retrieving recommendations: ${error.message}`);
//     }
//   },

//   // Lấy chi tiết khuyến nghị theo ID
//   getRecommendationById: async (id) => {
//     try {
//       const recommendation = await Recommendation.findById(id).exec();
//       if (!recommendation) {
//         throw new Error("Recommendation not found");
//       }
//       return recommendation;
//     } catch (error) {
//       throw new Error(`Error retrieving recommendation: ${error.message}`);
//     }
//   },

//   // Tạo khuyến nghị mới
//   createRecommendation: async (userId, recommendedItems, interactions) => {
//     try {
//       const now = new Date();
//       const newRecommendation = new Recommendation({
//         user: userId,
//         recommendedItems,
//         interactions,
//         algorithm: "collaborative_filtering", // Cần điều chỉnh dựa trên thuật toán được sử dụng
//         generatedAt: now,
//         expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Thời hạn 7 ngày
//         stateRecommendation: "pending",
//         status: "active",
//         modifieon: now,
//         disabledAt: null,
//       });

//       await newRecommendation.save();
//       return newRecommendation;
//     } catch (error) {
//       throw new Error(`Error creating recommendation: ${error.message}`);
//     }
//   },

//   // Soft delete khuyến nghị
//   softDeleteRecommendation: async (id) => {
//     try {
//       const nowUtc = new Date();
//       const offset = 7 * 60 * 60 * 1000; // Chuyển đổi thời gian UTC sang múi giờ Việt Nam (UTC + 7)
//       const now = new Date(nowUtc.getTime() + offset);

//       const recommendation = await Recommendation.findByIdAndUpdate(
//         id,
//         { status: "inactive", disabledAt: now },
//         { new: true }
//       ).exec();

//       if (!recommendation) {
//         throw new Error("Recommendation not found");
//       }

//       return recommendation;
//     } catch (error) {
//       throw new Error(`Error soft deleting recommendation: ${error.message}`);
//     }
//   },

//   // Khôi phục khuyến nghị đã bị xóa
//   restoreRecommendation: async (id) => {
//     try {
//       const recommendation = await Recommendation.findByIdAndUpdate(
//         id,
//         { status: "active", disabledAt: null },
//         { new: true }
//       ).exec();

//       if (!recommendation) {
//         throw new Error("Recommendation not found");
//       }

//       return recommendation;
//     } catch (error) {
//       throw new Error(`Error restoring recommendation: ${error.message}`);
//     }
//   },

//   // Lấy danh sách các khuyến nghị đã bị xóa
//   getDeletedRecommendations: async (page = 1, limit = 10) => {
//     try {
//       // Tính toán các thông số phân trang
//       const skip = (page - 1) * limit;
//       const recommendations = await Recommendation.find({ status: "inactive" })
//         .skip(skip)
//         .limit(limit)
//         .sort({ modifieon: -1 }) // Sắp xếp theo thời gian gần nhất
//         .exec();

//       const total = await Recommendation.countDocuments({
//         status: "inactive",
//       }).exec(); // Tổng số bản ghi

//       return {
//         total,
//         page,
//         limit,
//         recommendations,
//       };
//     } catch (error) {
//       throw new Error(
//         `Error retrieving deleted recommendations: ${error.message}`
//       );
//     }
//   },
// };

// module.exports = recommendationService;
