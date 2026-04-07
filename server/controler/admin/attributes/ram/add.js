const { convertToLocalTime } = require('../../../../utils/timeConverter'); 

const Ram = require('../../../../model/attributes/ram');
const { checkRamNameExists } = require('../validators/checkRam');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator'); 

const addRam = async (req, res) => {
  try {
    const { name, description } = req.body; 

    // Kiểm tra tên RAM
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        err: 2,
        msg: 'Tên RAM không hợp lệ',
        status: 400,
      });
    }

    // Kiểm tra tên RAM đã tồn tại
    const existingRam = await checkRamNameExists(name);
    if (existingRam) {
      return res.status(400).json({
        success: false,
        err: 3,
        msg: 'RAM với tên này đã tồn tại',
        status: 400,
      });
    }

    // Kiểm tra mô tả RAM
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({
        success: false,
        err: 4,
        msg: 'Mô tả RAM không được bỏ trống',
        status: 400,
      });
    }

    // Tạo mới RAM
    const newRam = new Ram({
      name,
      status: 'active',
      sku: generateSKU(name),
      pid: uuidv4(),
      description: description || '',
    });

    await newRam.save();

    const localCreatedAt = convertToLocalTime(newRam.createdAt);
    const localUpdatedAt = convertToLocalTime(newRam.updatedAt);

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'RAM mới đã được thêm thành công',
      status: 201,
      ram: {
        ...newRam.toObject(),
        createdAt: localCreatedAt,
        updatedAt: localUpdatedAt,
      },
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
