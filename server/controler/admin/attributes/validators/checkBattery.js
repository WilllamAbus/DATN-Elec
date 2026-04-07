const Battery = require('../../../../model/attributes/battery');
const checkBatteryNameExists = async (name) => {
  try {
    const existingBattery = await Battery.findOne({ name });
    return existingBattery !== null;
  } catch (error) {
    throw new Error('Có lỗi xảy ra khi kiểm tra tên pin');
  }
};
module.exports = {
  checkBatteryNameExists,
};
