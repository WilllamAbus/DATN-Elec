const { ObjectId } = require("mongoose").Types;

const Recommendation = require("../../../model/recommendation/recommendation.js");
const ProductVariant = require("../../../model/product_v2/productVariant.js");

const recommendations = {
  getRecommendationsByUserId: async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('User ID:', userId);

      // Kiểm tra tính hợp lệ của userId
      if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          err: 1,
          msg: "userId không hợp lệ"
        });
      }

      // Tìm tất cả các recommendation cho userId
      const recommendations = await Recommendation.find({ user: ObjectId(userId) });

      // Kiểm tra nếu không tìm thấy recommendation nào
      if (!recommendations || recommendations.length === 0) {
        return res.status(404).json({
          success: false,
          err: 2,
          msg: "Không tìm thấy recommendation cho userId này",
        });
      }

      // Lấy tất cả recommendedItems từ các recommendation
      let allRecommendedItems = [];
      recommendations.forEach((rec) => {
        if (rec.recommendedItems) {
          allRecommendedItems = allRecommendedItems.concat(rec.recommendedItems);
        }
      });

      // Chỉ lấy các items loại 'productVariant'
      const filteredItems = allRecommendedItems.filter(item => item.itemType === "productVariant");

      // Sắp xếp các items theo điểm số giảm dần và chỉ lấy 4 sản phẩm có điểm cao nhất
      const sortedItems = filteredItems
        .filter(item => item.score > 0)  // Lọc các item có score > 0
        .sort((a, b) => b.score - a.score)  // Sắp xếp theo điểm số giảm dần
        .slice(0, 10);

      // Lấy thông tin chi tiết từ productVariant
      const result = [];
      const uniqueItemDetails = new Set();  // Set để theo dõi các itemDetails._id đã có

      for (const item of sortedItems) {
        if (!item.item || !ObjectId.isValid(item.item)) {
          console.warn(`itemId không hợp lệ: ${item.item}`);
          continue;  // Bỏ qua nếu itemId không hợp lệ
        }

        // Tìm thông tin chi tiết từ collection productVariant và populate hình ảnh, giá, discount
        const itemDetails = await ProductVariant.findById(item.item)
          .populate('image')  // Populating hình ảnh từ imageVariant
          .populate('product_discount')
          .populate({
            path: 'product', // Truy xuất thông tin sản phẩm từ trường product
            select: 'weight_g product_ratingAvg slug' // Chỉ lấy các trường cần thiết
          })
          .exec();

        if (itemDetails) {
          // Kiểm tra nếu _id của itemDetails đã xuất hiện trong Set, nếu có thì bỏ qua
          if (uniqueItemDetails.has(itemDetails._id.toString())) {
            continue; // Bỏ qua sản phẩm trùng lặp hoàn toàn
          }
          uniqueItemDetails.add(itemDetails._id.toString());

          result.push({
            itemId: item.item,
            itemType: item.itemType,
            score: item.score,
            itemDetails: itemDetails,  // Thêm thông tin chi tiết vào kết quả
            images: itemDetails.image,  // Thêm thông tin hình ảnh vào kết quả
            variantPrice: itemDetails.variant_price, // Thêm variant_price
            discountPercent: itemDetails.product_discount ? itemDetails.product_discount.discountPercent : 0, // Lấy discount từ product_discount
            productRatingAvg: itemDetails.product_ratingAvg, // Lấy product_ratingAvg
            weight: itemDetails.weight_g // Lấy weight
          });
        }
      }

      // Nếu không tìm thấy sản phẩm hợp lệ
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          err: 4,
          msg: "Không tìm thấy sản phẩm gợi ý hợp lệ",
        });
      }

      // Trả về kết quả
      return res.status(200).json({
        success: true,
        msg: "Danh sách sản phẩm gợi ý",
        userId: userId,
        recommendations: result,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        success: false,
        err: 3,
        msg: "Lỗi hệ thống",
        status: 500,
        error: error.message,
      });
    }
  }
};

module.exports = recommendations;
