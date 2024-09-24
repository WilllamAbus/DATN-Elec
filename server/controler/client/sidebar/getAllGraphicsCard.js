const modelGraphicsCard = require('../../../model/attributes/graphicsCard'); 

const getAllGraphicsCard = async (req, res) => {
  try {
    const graphicsCards = await modelGraphicsCard.find({ status: { $ne: 'disable' } }); 
    const total = await modelGraphicsCard.countDocuments({ status: { $ne: 'disable' } });

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      total, 
      graphicsCards 
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 1,
      msg: 'Lỗi',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = { getAllGraphicsCard };
