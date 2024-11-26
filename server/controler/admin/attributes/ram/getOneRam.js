const Ram = require('../../../../model/attributes/ram');
const { convertToLocalTime } = require('../../../../utils/timeConverter');

const getOneRam = async (req, res) => {
  try {
    const { ramId } = req.params; 
    const ram = await Ram.findById(ramId); 

    if (!ram) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Không tìm thấy RAM',
        status: 404,
      });
    }

    const ramData = ram.toObject();
    ramData.createdAt = convertToLocalTime(ramData.createdAt);
    ramData.updatedAt = convertToLocalTime(ramData.updatedAt);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Lấy thông tin RAM thành công',
      status: 200,
      ram: ramData,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin RAM:', error);
    return res.status(500).json({
      success: false,
      err: 2,
      msg: 'Có lỗi xảy ra khi lấy thông tin RAM',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  getOneRam,
};
