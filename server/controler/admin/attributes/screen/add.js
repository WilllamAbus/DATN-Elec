const Screen = require('../../../../model/attributes/screen');
const { checkScreenNameExists } = require('../validators/checkScreen');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator');

const addScreen = async (req, res) => {
  try {
    const existingScreen = await checkScreenNameExists(req.body.name);
    if (existingScreen) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Màn hình với tên này đã tồn tại',
        status: 400
      });
    }
    const newScreen = new Screen({
      name: req.body.name,
      status: req.body.status || 'active',
      sku: generateSKU(req.body.name),
      pid: req.body.pid || uuidv4(),
    });
    await newScreen.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Màn hình mới đã được thêm thành công',
      status: 201,
      screen: newScreen,
    });
  } catch (error) {
    console.error('Lỗi khi thêm màn hình:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm màn hình',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addScreen,
};
