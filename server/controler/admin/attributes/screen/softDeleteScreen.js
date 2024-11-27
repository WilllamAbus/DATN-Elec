const Screen = require('../../../../model/attributes/screen');
const Role = require('../../../../model/role.model');
const { convertToLocalTime } = require('../../../../utils/timeConverter'); 

const softDeleteScreen = async (req, res) => {
  try {
    // Kiểm tra quyền admin
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      return res.status(500).json({
        success: false,
        err: 1,
        msg: "Không tìm thấy vai trò quản trị viên",
        status: 500,
      });
    }

    if (!req.user || !Array.isArray(req.user.roles)) {
      return res.status(403).json({
        success: false,
        err: 1,
        msg: "Người dùng không có quyền truy cập.",
        status: 403,
      });
    }

    const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        err: 1,
        msg: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa màn hình",
        status: 403,
      });
    }

    // Lấy ID màn hình từ request
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: "ID màn hình không hợp lệ",
        status: 400,
      });
    }

    // Thực hiện xoá mềm màn hình bằng cách cập nhật status thành 'disabled'
    const softDeletedScreen = await Screen.findByIdAndUpdate(
      id,
      { 
        status: 'disabled', 
        deletedAt: new Date() // Đặt thời gian xóa mềm là thời điểm hiện tại
      },
      { new: true }
    );
    if (!softDeletedScreen) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: "Không tìm thấy màn hình",
        status: 404,
      });
    }

    // Chuyển đổi `deletedAt` sang múi giờ địa phương trước khi trả về
    const responseData = {
      ...softDeletedScreen.toObject(),
      deletedAt: convertToLocalTime(softDeletedScreen.deletedAt),
    };

    // Trả về kết quả xoá mềm thành công
    res.status(200).json({
      success: true,
      err: 0,
      msg: 'Đã xoá màn hình thành công',
      status: 200,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: 1,
      msg: "Lỗi server",
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  softDeleteScreen,
};
