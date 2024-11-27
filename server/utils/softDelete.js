const moment = require('moment'); // Thư viện hỗ trợ tính toán thời gian

// Hàm xóa vĩnh viễn các tài nguyên bị xóa mềm quá expirationDays
const softDeleteForModel = async (model, query = {}, expirationDays = 1) => {
  // Tính thời gian expirationDays trước
  const expirationDate = moment().subtract(expirationDays, 'days');

  try {
    // Xóa tất cả tài nguyên có trạng thái 'disabled' và đã xóa mềm lâu hơn expirationDays
    const result = await model.deleteMany({
      ...query,
      deletedAt: { $lte: expirationDate.toDate() },
    });

    console.log(`Đã xóa vĩnh viễn ${result.deletedCount} tài nguyên.`);
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error('Lỗi khi xóa tài nguyên:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = softDeleteForModel;
