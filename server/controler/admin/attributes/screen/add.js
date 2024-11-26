const { convertToLocalTime } = require('../../../../utils/timeConverter'); 

const Screen = require('../../../../model/attributes/screen');
const { checkScreenNameExists } = require('../validators/checkScreen');
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator');

const addScreen = async (req, res) => {
  try {
    const { name, description } = req.body; 

    // Kiểm tra tên màn hình
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        err: 2,
        msg: 'Tên màn hình không hợp lệ',
        status: 400,
      });
    }

    // Kiểm tra tên màn hình đã tồn tại
    const existingScreen = await checkScreenNameExists(name);
    if (existingScreen) {
      return res.status(400).json({
        success: false,
        err: 3,
        msg: 'Màn hình với tên này đã tồn tại',
        status: 400,
      });
    }
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({
        success: false,
        err: 4,
        msg: 'Mô tả màn hình không được bỏ trống',
        status: 400,
      });
    }
    // Tạo mới màn hình
    const newScreen = new Screen({
      name,
      status: 'active',
      sku: generateSKU(name),
      pid: uuidv4(),
      description: description || '',
    });

    await newScreen.save();

    const localCreatedAt = convertToLocalTime(newScreen.createdAt);
    const localUpdatedAt = convertToLocalTime(newScreen.updatedAt);

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Màn hình mới đã được thêm thành công',
      status: 201,
      screen: {
        ...newScreen.toObject(),
        createdAt: localCreatedAt,
        updatedAt: localUpdatedAt,
      },
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
