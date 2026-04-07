const GraphicsCard = require('../../../../model/attributes/graphicsCard');

const checkGraphicsCardNameExists = async (name) => {
  try {
    const existingGraphicsCard = await GraphicsCard.findOne({ name });
    return existingGraphicsCard !== null;  
  } catch (error) {
    throw new Error('Có lỗi xảy ra khi kiểm tra card đồ họa');
  }
};

module.exports = {
  checkGraphicsCardNameExists,
};
