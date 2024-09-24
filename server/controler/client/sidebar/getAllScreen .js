const modelScreen = require('../../../model/attributes/screen'); 
const getAllScreen = async (req, res) => {
  try {
    const screens = await modelScreen.find({ status: { $ne: 'disable' } }); 
    const total = await modelScreen.countDocuments({ status: { $ne: 'disable' } });
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      total, 
      screens 
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

module.exports = { getAllScreen };
