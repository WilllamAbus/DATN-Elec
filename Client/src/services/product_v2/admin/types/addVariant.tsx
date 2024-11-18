
export const RESPONSE_MESSAGES = {
  VARIANT_NAME_DUPLICATE_PRODUCT: 'Tên biến thể không được trùng với tên sản phẩm gốc',
  VARIANT_NAME_EXISTS: (variant_name: string) => `Tên biến thể '${variant_name}' đã tồn tại cho sản phẩm này`,
  VARIANT_ADDED_SUCCESS: 'Biến thể mới đã được thêm thành công',
  VARIANT_ADD_ERROR: 'Có lỗi xảy ra khi thêm biến thể sản phẩm',
  VARIANT_UPDATE_ERROR:'Có lỗi xảy ra khi thêm biến thể sản phẩm',
  PRODUCT_NOT_FOUND: 'Sản phẩm không tồn tại',
};


export const STATUS_CODES = {
  SUCCESS: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
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

export interface Discount {
  _id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: string;
  disabledAt: Date | null;
  createdAt: string;
  updatedAt: string;
}
export interface ProductVariant {
  variant_name: string;                
  variant_description: string;         
  variant_price: number;    
  variant_original_price:number;    
  product_discount: Discount;       
  battery: BATTERY[];                    
  color: COLOR[];                   
  cpu: CPU[];                     
  graphicsCard: GRAPHICSCARD[];             
  operatingSystem: OPERATINGSYSTEM[];          
  ram: RAM[];                    
  screen: SCREEN[];                   
  storage: STORAGE[];                           
  sku: string;                         
  pid: string;                        
  status: 'active' | 'inactive';      
  product: string;                     
  inventory?: string[];                
  _id: string;                         
  createdAt: string;                   
  updatedAt: string;                   
  slug: string;                                           
}


export interface ProductVariantResponse {
  success: boolean;                 
  err: number;                 
  msg: string;                      
  status: number;                    
  variant: ProductVariant | null;      
}

export interface ProductStateVariant {
  variants: ProductVariant[];   
  status: "idle" | "loading" | "success" | "fail"; 
  error: string | null;    
  isLoading: boolean;          
}
export const initialVariantState: ProductStateVariant = {
  variants: [],
  status: "idle",
  error: null,
  isLoading: false,
};


