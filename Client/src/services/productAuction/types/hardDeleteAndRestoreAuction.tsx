export interface ProductDiscount {
  discountId: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: string;
  disabledAt: string | null; 
}

export interface Comment {
  user: string; 
  content: string;
  rating: number;
  createdAt: string;
}
export interface ProductAuction {
  _id: string;
  product_name: string;
  image: string[];
  product_description: string;
  slug: string;
  product_type: string; 
  product_discount?: ProductDiscount; 
  product_brand: string; 
  product_condition: string; 
  product_supplier: string;
  product_ratingAvg: number;
  product_view: number;
  product_price: number;
  product_price_unit: number;
  weight_g: number;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}



export interface ResponseSuccess {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data?: any;
}

export interface ErrorResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
}

export const ERRORS = {
  ADMIN_NOT_FOUND: "Không tìm thấy vai trò quản trị viên",
  USER_NO_ACCESS: "Người dùng không có quyền truy cập.",
  ACCESS_DENIED: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa sản phẩm",
  INVALID_PRODUCT_ID: "ID sản phẩm không hợp lệ",
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",
  PRODUCT_ALREADY_DELETED: "Sản phẩm này đã bị xóa trước đó",
  SERVER_ERROR: "Lỗi server",
};

export const SUCCESS = {
  PRODUCT_DELETED: "Đã xóa thành công",
  PRODUCT_RESTORED: "Sản phẩm đã được khôi phục thành công",
};


export const STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SUCCESS_DELETE: 200,
};
export interface ErrorResponse {
  msg: string;
}
export interface ProductAuctionStateHardDelete  {
  products: ProductAuction[]; 
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
  isLoading: boolean;
};

export const initialHardDeleteAuctionState: ProductAuctionStateHardDelete = {
  products: [],
  status: "idle",
  error: null, 
  isLoading: false,

};
export interface ProductAuctionStateRestore {
  products: ProductAuction[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
  isLoading: boolean;
};

export const initialRestoreAuctionState: ProductAuctionStateRestore = {
  products: [],
  status: "idle",
  error: null, 
  isLoading: false,
};