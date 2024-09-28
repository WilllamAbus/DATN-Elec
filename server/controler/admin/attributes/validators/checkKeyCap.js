const KeyCap = require('../../../../model/attributes/keycap'); 

const checkKeyCapNameExists = async (name) => {
  try {
    const keycap = await KeyCap.findOne({ name });
    return keycap !== null; 
  } catch (error) {
    console.error('Lỗi khi kiểm tra keycap:', error);
    throw new Error('Có lỗi xảy ra khi kiểm tra keycap');
  }
};

module.exports = {
  checkKeyCapNameExists,
};
