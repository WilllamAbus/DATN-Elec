const GraphicsCard = require('../../../../model/attributes/graphicsCard');
const { checkGraphicsCardNameExists } = require('../validators/checkGraphicsCard'); 
const { v4: uuidv4 } = require('uuid');
const generateSKU = require('../sku/skuGenerator'); 
const addGraphicsCard = async (req, res) => {
  try {
    const existingGraphicsCard = await checkGraphicsCardNameExists(req.body.name);
    if (existingGraphicsCard) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: 'Card đồ họa với tên này đã tồn tại',
        status: 400
      });
    }
    const newGraphicsCard = new GraphicsCard({
      name: req.body.name,
      status: req.body.status || 'active',
      sku: generateSKU(req.body.name),
      pid: req.body.pid || uuidv4(),
    });

    await newGraphicsCard.save();

    return res.status(201).json({
      success: true,
      err: 0,
      msg: 'Card đồ họa mới đã được thêm thành công',
      status: 201,
      graphicsCard: newGraphicsCard,
    });
  } catch (error) {
    console.error('Lỗi khi thêm card đồ họa:', error);
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Có lỗi xảy ra khi thêm card đồ họa',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addGraphicsCard,
};
