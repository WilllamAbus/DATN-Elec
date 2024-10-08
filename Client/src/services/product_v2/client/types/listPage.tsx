interface ProductDiscountClient {
  discountId: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
}
export interface products {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: { name: string };
  createdAt: string;
  product_discount: ProductDiscountClient;
  view: number;
  rating: number;
  product_supplier: string;
  product_brand: string;
  product_format: string;
  product_condition: string;
  product_quantity: number;
  product_price: number;
  product_attributes: { k: string; v: string }[];
  weight_g: number;
  image: string[];
  status: string;
}
export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface LimitPageProductResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    products: products[];
  };
  pagination: Pagination;
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
export interface RAM {
  _id: string;
  name: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  size?: number; 
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
