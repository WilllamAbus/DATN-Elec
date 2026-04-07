const Ram = require('../../../../model/attributes/ram');
const { convertToLocalTime } = require('../../../../utils/timeConverter');
const { checkRamNameExists } = require('../validators/checkRam'); // Giả sử bạn đã có hàm kiểm tra tên RAM

const editRam = async (req, res) => {
  try {
    const { ramId } = req.params; // Lấy ID RAM từ params
    const { name, description } = req.body; // Lấy dữ liệu cần chỉnh sửa từ body

    // Tìm RAM cần chỉnh sửa
    const ram = await Ram.findById(ramId);
    if (!ram) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: 'Không tìm thấy RAM',
        status: 404,
      });
    }

    // Kiểm tra tên RAM
    if (name) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          success: false,
          err: 2,
          msg: 'Tên RAM không hợp lệ',
          status: 400,
        });
      }

      // Kiểm tra tên RAM đã tồn tại (trừ RAM hiện tại)
      const existingRam = await checkRamNameExists(name);
      if (existingRam && existingRam._id.toString() !== ramId) {
        return res.status(400).json({
          success: false,
          err: 3,
          msg: 'Tên RAM đã tồn tại',
          status: 400,
        });
      }

      ram.name = name; // Cập nhật tên
    }

    // Kiểm tra và cập nhật mô tả RAM
    if (description) {
      if (typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({
          success: false,
          err: 4,
          msg: 'Mô tả không hợp lệ',
          status: 400,
        });
      }

      ram.description = description; // Cập nhật mô tả
    }

    // Lưu các thay đổi vào cơ sở dữ liệu
    await ram.save();

    // Chuyển đổi thời gian sang local
    const localCreatedAt = convertToLocalTime(ram.createdAt);
    const localUpdatedAt = convertToLocalTime(ram.updatedAt);

    return res.status(200).json({
      success: true,
      err: 0,
      msg: 'Cập nhật thông tin RAM thành công',
      status: 200,
      ram: {
        ...ram.toObject(),
        createdAt: localCreatedAt,
        updatedAt: localUpdatedAt,
      },
    });
  } catch (error) {
    console.error('Lỗi khi chỉnh sửa RAM:', error);
    return res.status(500).json({
      success: false,
      err: 5,
      msg: 'Có lỗi xảy ra khi chỉnh sửa RAM',
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  editRam,
};
