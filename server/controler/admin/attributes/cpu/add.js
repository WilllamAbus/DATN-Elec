const Cpu = require('../../../../model/attributes/cpu');
const { checkCpuNameExists } = require('../validators/checkCpu'); 
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator');
const addCpu = async (req, res) => {
  try {
    const existingCpu = await checkCpuNameExists(req.body.name);
    if (existingCpu) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'CPU với tên này đã tồn tại',
        status: 400
      });
    }
    const newCpu = new Cpu({
      name: req.body.name,
      status: req.body.status || 'active',
      sku: generateSKU(req.body.name),
      pid: req.body.pid || uuidv4(),
    });

    await newCpu.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'CPU mới đã được thêm thành công',
      status: 201,
      cpu: newCpu,
    });
  } catch (error) {
    console.error('Lỗi khi thêm CPU:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm CPU',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addCpu,
};
