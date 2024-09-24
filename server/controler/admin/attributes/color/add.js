const Color = require('../../../../model/attributes/color');
const { checkColorNameExists } = require('../validators/checkColor');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator');
const getColorCode = require('./colorMap');

const addColor = async (req, res) => {
  try {
    const existingColor = await checkColorNameExists(req.body.name);
    if (existingColor) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Màu với tên này đã tồn tại',
        status: 400
      });
    }

    const newColor = new Color({
      name: req.body.name,
      code: getColorCode(req.body.name), 
      status: req.body.status || 'active',
      sku: generateSKU(req.body.name), 
      pid: req.body.pid || uuidv4(),
    });

    await newColor.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Màu mới đã được thêm thành công',
      status: 201,
      color: newColor,
    });
  } catch (error) {
    console.error('Lỗi khi thêm màu:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm màu',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addColor,
};
