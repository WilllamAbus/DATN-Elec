const OperatingSystem = require('../../../../model/attributes/operatingSystem');
const checkOSNameAndVersionExists = async (name, version) => {
  try {
    const existingOS = await OperatingSystem.findOne({ name, version });
    return existingOS !== null;  
  } catch (error) {
    throw new Error('Có lỗi xảy ra khi kiểm tra hệ điều hành');
  }
};

module.exports = {
  checkOSNameAndVersionExists,
};
