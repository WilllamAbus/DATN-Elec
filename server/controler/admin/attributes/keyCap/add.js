const KeyCap = require('../../../../model/attributes/keycap'); 
const { checkKeyCapNameExists } = require('../validators/checkKeyCap'); 
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator'); 

const addKeyCap = async (req, res) => {
  try {
    const existingKeyCap = await checkKeyCapNameExists(req.body.name);
    if (existingKeyCap) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'KeyCap với tên này đã tồn tại',
        status: 400
      });
    }
    const newKeyCap = new KeyCap({
      name: req.body.name,
      material: req.body.material,
      status: req.body.status || 'active',
      sku: generateSKU(req.body.name), 
      pid: req.body.pid || uuidv4(),
    });


    await newKeyCap.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'KeyCap mới đã được thêm thành công',
      status: 201,
      keycap: newKeyCap,
    });
  } catch (error) {
    console.error('Lỗi khi thêm KeyCap:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm KeyCap',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addKeyCap,
};
