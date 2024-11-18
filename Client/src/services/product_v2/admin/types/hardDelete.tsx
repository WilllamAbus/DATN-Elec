
export const STATUS_CODES = {
  SUCCESS: 201,
  SUCCESS_DELETE: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
};


export const RESPONSE_MESSAGES_CRUD = {
  ADMIN_ROLE_NOT_FOUND: "Không tìm thấy vai trò quản trị viên",
  USER_ACCESS_DENIED: "Người dùng không có quyền truy cập.",
  ACCESS_DENIED: "Quyền truy cập bị từ chối: Chỉ quản trị viên mới có thể xóa sản phẩm",
  INVALID_VARIANT_ID: "ID sản phẩm không hợp lệ",
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",
  SUCCESS_DELETE: 'Sản phẩm và các biến thể đã được xóa thành công',
  SERVER_ERROR: "Lỗi server",
  ERROR_NOT_DEFINED:"Lỗi không xác định"
};

export interface RAM {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface SCREEN {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface CPU {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}


export interface COLOR {
  _id: string;
  name: string;
  code: string; 
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  hex: string; 
}


export interface GRAPHICSCARD {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface BATTERY {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface OPERATINGSYSTEM {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface STORAGE {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}
export interface ProductVariant {
  variant_name: string;                
  variant_description: string;         
  variant_price: number;               
  battery: BATTERY[];                    
  color: COLOR[];                   
  cpu: CPU[];                     
  graphicsCard: GRAPHICSCARD[];             
  operatingSystem: OPERATINGSYSTEM[];          
  ram: RAM[];                    
  screen: SCREEN[];                   
  storage: STORAGE[];                    
  image?: FileList;                   
  sku: string;                         
  pid: string;                        
  status: 'active' | 'inactive';      
  product: string;                     
  inventory?: string[];                
  _id: string;                         
  createdAt: string;                   
  updatedAt: string;                   
  slug: string;                        
  __v: number;                         
}

export interface ProductDiscount {
  discountId: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: string;
  disabledAt: Date | null;
}

export interface Product {
  _id: string;
  product_name: string;
  image: string[];
  product_description: string;
  sku: string;
  pid: string;
  product_type: string;
  hasVariants: string; 
  product_brand: string;
  product_format: string;
  product_condition: string;
  product_supplier: string;
  product_ratingAvg: number;
  product_view: number;
  product_price: number;
  product_price_unit: number;
  weight_g: number;
  isActive: boolean;
  status: string;
  disabledAt: Date | null;
  variants: string[]; 
  comments: any[]; 
  product_attributes: any[]; 
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  __v: number;
}

export interface ResponseSuccess {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data?: Product | null; 
}

export interface ResponseError {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  error?: string;
}
export interface ErrorResponse {
  msg: string;
}
export interface ProductStateHardDelete  {
  products: Product[]; 
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string | null;
  isLoading: boolean;
};

export const initialHardDeleteState: ProductStateHardDelete = {
  products: [],
  status: "idle",
  error: null, 
  isLoading: false,
};