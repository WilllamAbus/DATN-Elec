const RESPONSE_MESSAGES = {
  VARIANT_NAME_DUPLICATE_PRODUCT: 'Tên biến thể không được trùng với tên sản phẩm gốc',
  VARIANT_NAME_EXISTS: (variant_name) => `Tên biến thể '${variant_name}' đã tồn tại cho sản phẩm này`,
  VARIANT_ADDED_SUCCESS: 'Biến thể mới đã được thêm thành công',
  VARIANT_ADD_ERROR: 'Có lỗi xảy ra khi thêm biến thể sản phẩm',
  PRODUCT_NOT_FOUND: 'Sản phẩm không tồn tại',
};

const STATUS_CODES = {
  SUCCESS: 201,
  SUCCESS_DELETE: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
};
const RESPONSE_MESSAGES_CRUD = {
  ADMIN_ROLE_NOT_FOUND: "Không tìm thấy vai trò quản trị viên",
  USER_ACCESS_DENIED: "Người dùng không có quyền truy cập.",
  ACCESS_DENIED: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa sản phẩm",
  INVALID_PRODUCT_ID: "ID sản phẩm không hợp lệ",
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",
  SUCCESS_DELETE: 'Sản phẩm và các biến thể đã được xóa thành công lalalala',
  SERVER_ERROR: "Lỗi server",
};
module.exports = {
  RESPONSE_MESSAGES,
  RESPONSE_MESSAGES_CRUD,
  STATUS_CODES,
};
