const Ram = require('../../../../model/attributes/ram');
const checkRamNameExists = async (name) => {
  try {
    return await Ram.findOne({ name });
  } catch (error) {
    console.error('Lỗi khi kiểm tra tên RAM:', error);
    throw new Error('Không thể kiểm tra tên RAM'); 
  }
};
const isValidRamName = (ramName) => {
  return typeof ramName === 'string' && ramName.trim() !== '';
};

const validateRamSku = (sku) => {
  return typeof sku === 'string' && sku.trim() !== '';
};

module.exports = {
  checkRamNameExists,
  isValidRamName,
  validateRamSku,
};
