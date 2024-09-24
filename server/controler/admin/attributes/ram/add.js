const Ram = require('../../../../model/attributes/ram');
const { checkRamNameExists } = require('../validators/checkRam');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator'); 
const addRam = async (req, res) => {
  try {
    const existingRam = await checkRamNameExists(req.body.name);
    if (existingRam) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'RAM với tên này đã tồn tại',
        status: 400
      });
    }
      const newRam = new Ram({
        name: req.body.name,
        status: req.body.status || 'active',
        sku: generateSKU(req.body.name), 
        pid: req.body.pid || uuidv4(),
      });
    await newRam.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'RAM mới đã được thêm thành công',
      status: 201,
      ram: newRam,
    });
  } catch (error) {
    console.error('Lỗi khi thêm RAM:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm RAM',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addRam,
};
