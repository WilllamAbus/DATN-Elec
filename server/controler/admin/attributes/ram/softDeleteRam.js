const Ram = require('../../../../model/attributes/ram');
const Role = require('../../../../model/role.model');
const { convertToLocalTime } = require('../../../../utils/timeConverter'); 

const softDeleteRam = async (req, res) => {
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
        msg: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa RAM",
        status: 403,
      });
    }

    // Lấy ID RAM từ request
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: "ID RAM không hợp lệ",
        status: 400,
      });
    }

    // Thực hiện xoá mềm RAM bằng cách cập nhật status thành 'disabled'
    const softDeletedRam = await Ram.findByIdAndUpdate(
      id,
      { 
        status: 'disabled', 
        deletedAt: new Date() // Đặt thời gian xóa mềm là thời điểm hiện tại
      },
      { new: true }
    );
    if (!softDeletedRam) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: "Không tìm thấy RAM",
        status: 404,
      });
    }

    // Chuyển đổi `deletedAt` sang múi giờ địa phương trước khi trả về
    const responseData = {
      ...softDeletedRam.toObject(),
      deletedAt: convertToLocalTime(softDeletedRam.deletedAt),
    };

    // Trả về kết quả xoá mềm thành công
    res.status(200).json({
      success: true,
      err: 0,
      msg: 'Đã xoá RAM thành công',
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
  softDeleteRam,
};
