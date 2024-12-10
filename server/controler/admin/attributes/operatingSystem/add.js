const OperatingSystem = require('../../../../model/attributes/operatingSystem');
const { checkOSNameAndVersionExists } = require('../validators/checkOperatingSystem');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator');

const addOperatingSystem = async (req, res) => {
  try {
    const existingOS = await checkOSNameAndVersionExists(req.body.name, req.body.version);
    if (existingOS) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Hệ điều hành với tên và phiên bản này đã tồn tại',
        status: 400
      });
    }

    const newOperatingSystem = new OperatingSystem({
      name: req.body.name,
      status: req.body.status || 'active',
      sku: generateSKU(req.body.name),
      pid: req.body.pid || uuidv4(),
    });

    await newOperatingSystem.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Hệ điều hành mới đã được thêm thành công',
      status: 201,
      operatingSystem: newOperatingSystem,
    });
  } catch (error) {
    console.error('Lỗi khi thêm hệ điều hành:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm hệ điều hành',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addOperatingSystem,
};
