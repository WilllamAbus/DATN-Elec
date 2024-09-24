const modelStorage = require('../../../model/attributes/storage'); 
const getAllStorage = async (req, res) => {
  try {
    const storages = await modelStorage.find({ status: { $ne: 'disable' } });
    const total = await modelStorage.countDocuments({ status: { $ne: 'disable' } }); 
    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      total, 
      storages 
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

module.exports = { getAllStorage };
