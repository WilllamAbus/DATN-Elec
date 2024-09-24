const Battery = require('../../../../model/attributes/battery');
const { checkBatteryNameExists } = require('../validators/checkBattery');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator');

const addBattery = async (req, res) => {
  try {
    const existingBattery = await checkBatteryNameExists(req.body.name);
    if (existingBattery) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Pin với tên này đã tồn tại',
        status: 400
      });
    }

    const newBattery = new Battery({
      name: req.body.name,
      status: req.body.status || 'active',
      sku: generateSKU(req.body.name),
      pid: req.body.pid || uuidv4(),
    });

    await newBattery.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Pin mới đã được thêm thành công',
      status: 201,
      battery: newBattery,
    });
  } catch (error) {
    console.error('Lỗi khi thêm pin:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm pin',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addBattery,
};
