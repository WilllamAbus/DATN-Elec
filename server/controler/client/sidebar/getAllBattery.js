const modelBattery = require('../../../model/attributes/battery');
const getAllBattery = async (req, res) => {
  try {
    const batteries = await modelBattery.find({ status: { $ne: 'disable' } });
    const total = await modelBattery.countDocuments({ status: { $ne: 'disable' } }); 

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      total, 
      batteries 
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

module.exports = { getAllBattery };
