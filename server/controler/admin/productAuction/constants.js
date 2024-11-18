module.exports = {
  ERRORS: {
    ADMIN_NOT_FOUND: "Không tìm thấy vai trò quản trị viên",
    USER_NO_ACCESS: "Người dùng không có quyền truy cập.",
    ACCESS_DENIED: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa sản phẩm",
    INVALID_PRODUCT_ID: "ID sản phẩm không hợp lệ",
    PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",
    PRODUCT_ALREADY_DELETED: "Sản phẩm này đã bị xóa trước đó",
    SERVER_ERROR: "Lỗi server",
  },
  SUCCESS: {
    PRODUCT_DELETED: "Đã xóa thành công",
    PRODUCT_RESTORED: "Sản phẩm đã được khôi phục thành công",
  },
  STATUS_CODES: {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    SUCCESS_DELETE: 200,
  }
};
