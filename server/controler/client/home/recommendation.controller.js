const { ObjectId } = require("mongoose").Types;
const Recommendation = require("../../../model/recommendation/recommendation.js");

const getRecommendationsByUserId = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    // Kiểm tra ObjectId hợp lệ
    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        err: 1, 
        msg: "userId không hợp lệ" 
      });
    }

    // Truy vấn các bản ghi recommendation của user
    const recommendations = await Recommendation.find({ user: ObjectId(userId) });

    // Kiểm tra nếu không có dữ liệu
    if (!recommendations || recommendations.length === 0) {
      return res.status(404).json({
        success: false,
        err: 2,
        msg: "Không tìm thấy recommendation cho userId này",
      });
    }

    let allRecommendedItems = [];

    // Gom toàn bộ sản phẩm được recommend
    recommendations.forEach((rec) => {
      if (rec.recommendedItems) {
        allRecommendedItems = allRecommendedItems.concat(rec.recommendedItems);
      }
    });

    // Lọc các sản phẩm thuộc hai loại productVariant và productAuction
    const filteredItems = allRecommendedItems.filter(item => 
      item.itemType === "productVariants" || item.itemType === "productAuction"
    );

    // Chỉ giữ lại các sản phẩm có score > 0 và sắp xếp theo score giảm dần
    const sortedItems = filteredItems
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    // Chuẩn hóa dữ liệu trả về
    const result = sortedItems.map(item => {
      const itemId = item.item;

      // Kiểm tra nếu item.item là ObjectId hợp lệ
      if (!ObjectId.isValid(itemId)) {
        console.warn(`itemId không hợp lệ: ${itemId}`);
        return null; // Hoặc bạn có thể xử lý theo cách khác, như ném lỗi hoặc ghi log
      }

      // Chuyển đổi thành ObjectId
      const itemObjectId = ObjectId(itemId);

      return {
        itemId: itemObjectId,
        itemType: item.itemType,
        score: item.score,
      };
    }).filter(item => item !== null); // Lọc bỏ các item null

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
};

module.exports = {
  getRecommendationsByUserId,
};