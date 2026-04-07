const modelProduct = require("../../../model/product_v2");
const Role = require('../../../model/role.model');
const restore = async (req, res) => {
  try {
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      return res.status(500).json({
        success: false,
        err: 1,
        msg: "Không tìm thấy vai trò quản trị viên",
        status: 500
      });
    }
    if (!req.user || !Array.isArray(req.user.roles)) {
      return res.status(403).json({
        success: false,
        err: 1,
        msg: "Người dùng không có quyền truy cập.",
        status: 403
      });
    }
    const isAdmin = req.user.roles.some(role => role._id.toString() === adminRole._id.toString());
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        err: 1,
        msg: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể khôi phục sản phẩm",
        status: 403
      });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        err: 1,
        msg: "ID sản phẩm không hợp lệ",
        status: 400
      });
    }
    const restoreProduct = await modelProduct.findByIdAndUpdate(id, { status: 'active' }, { new: true });
    if (!restoreProduct) {
      return res.status(404).json({
        success: false,
        err: 1,
        msg: "Không tìm thấy sản phẩm",
        status: 404
      });
    }
    res.status(200).json({
      success: true,
      err: 0,
      msg: "Sản phẩm đã được khôi phục thành công ok",
      status: 200,
      data: restoreProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: 1,
      msg: "Lỗi server",
      status: 500,
      error: error.message
    });
  }
};

module.exports = {
  restore,
};
