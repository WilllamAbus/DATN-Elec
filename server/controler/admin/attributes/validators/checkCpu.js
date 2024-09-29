const Cpu = require('../../../../model/attributes/cpu');
const checkCpuNameExists = async (name) => {
  try {
    const existingCpu = await Cpu.findOne({ name });
    return existingCpu !== null;  
  } catch (error) {
    throw new Error('Có lỗi xảy ra khi kiểm tra CPU');
  }
};
module.exports = {
  checkCpuNameExists,
};
