const Storage = require('../../../../model/attributes/storage'); 
const { checkStorageNameExists } = require('../validators/checkStorage'); 
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator'); 
const addStorage = async (req, res) => {
  try {
    const existingStorage = await checkStorageNameExists(req.body.name);
    if (existingStorage) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Storage với tên này đã tồn tại',
        status: 400
      });
    }
    const newStorage = new Storage({
      name: req.body.name,
      status: req.body.status || 'active',
      sku: generateSKU(req.body.name), 
      pid: req.body.pid || uuidv4(),
    });
    await newStorage.save();
    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Storage mới đã được thêm thành công',
      status: 201,
      storage: newStorage,
    });
  } catch (error) {
    console.error('Lỗi khi thêm Storage:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm Storage',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addStorage,
};
