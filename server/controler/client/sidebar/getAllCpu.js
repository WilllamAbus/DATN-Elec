const modelCpu = require('../../../model/attributes/cpu'); 
const getAllCpu = async (req, res) => {
  try {
    const cpus = await modelCpu.find({ status: { $ne: 'disable' } });
    const total = await modelCpu.countDocuments({ status: { $ne: 'disable' } }); 

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'OK',
      status: 200,
      total,
      cpus 
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

module.exports = { getAllCpu };
