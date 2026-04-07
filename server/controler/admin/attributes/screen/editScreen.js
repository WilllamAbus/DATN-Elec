const Screen = require('../../../../model/attributes/screen');
const { convertToLocalTime } = require('../../../../utils/timeConverter');
const { checkScreenNameExists } = require('../validators/checkScreen');

const editScreen = async (req, res) => {
  try {
    const { screenId } = req.params; // Lấy ID màn hình từ params
    const { name, description } = req.body; // Lấy dữ liệu cần chỉnh sửa từ body

    // Tìm màn hình cần chỉnh sửa
    const screen = await Screen.findById(screenId);
    if (!screen) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Không tìm thấy màn hình',
        status: 404,
      });
    }

    // Kiểm tra tên màn hình
    if (name) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          success: false,
          err: 2,
          msg: 'Tên màn hình không hợp lệ',
          status: 400,
        });
      }

      // Kiểm tra tên màn hình đã tồn tại (trừ màn hình hiện tại)
      const existingScreen = await checkScreenNameExists(name);
      if (existingScreen && existingScreen._id.toString() !== screenId) {
        return res.status(400).json({
          success: false,
          err: 3,
          msg: 'Tên màn hình đã tồn tại',
          status: 400,
        });
      }

      screen.name = name; // Cập nhật tên
    }

    // Kiểm tra và cập nhật mô tả màn hình
    if (description) {
      if (typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({
          success: false,
          err: 4,
          msg: 'Mô tả không hợp lệ',
          status: 400,
        });
      }

      screen.description = description; // Cập nhật mô tả
    }

    // Lưu các thay đổi vào cơ sở dữ liệu
    await screen.save();

    // Chuyển đổi thời gian sang local
    const localCreatedAt = convertToLocalTime(screen.createdAt);
    const localUpdatedAt = convertToLocalTime(screen.updatedAt);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Cập nhật thông tin màn hình thành công',
      status: 200,
      screen: {
        ...screen.toObject(),
        createdAt: localCreatedAt,
        updatedAt: localUpdatedAt,
      },
    });
  } catch (error) {
    console.error('Lỗi khi chỉnh sửa màn hình:', error);
    return res.status(500).json({
      success: false,
      err: 5,
      msg: 'Có lỗi xảy ra khi chỉnh sửa màn hình',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  editScreen,
};
