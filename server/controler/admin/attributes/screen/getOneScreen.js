const Screen = require('../../../../model/attributes/screen');
const { convertToLocalTime } = require('../../../../utils/timeConverter');

const getOneScreen = async (req, res) => {
  try {
    const { screenId } = req.params; 
    const screen = await Screen.findById(screenId); 

    if (!screen) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Không tìm thấy màn hình',
        status: 404,
      });
    }

    const screenData = screen.toObject();
    screenData.createdAt = convertToLocalTime(screenData.createdAt);
    screenData.updatedAt = convertToLocalTime(screenData.updatedAt);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Lấy thông tin màn hình thành công',
      status: 200,
      screen: screenData,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin màn hình:', error);
    return res.status(500).json({
      success: false,
      err: 2,
      msg: 'Có lỗi xảy ra khi lấy thông tin màn hình',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  getOneScreen,
};
