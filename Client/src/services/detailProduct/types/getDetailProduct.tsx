
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
export interface Image {
  _id: string; 
  image: string[]; 
  productVariant: string;
  color: string;
}
export interface ProductVariant {
  variant_name: string;                
  variant_description: string;         
  variant_price: number;               
  battery: BATTERY;                    
  color?: COLOR[];                 
  cpu?: CPU;                     
  graphicsCard?: GRAPHICSCARD;             
  operatingSystem?: OPERATINGSYSTEM;          
  ram?: RAM;                    
  screen?: SCREEN;                   
  storage?: STORAGE;                    
  image?: Image[];                 
  sku: string;                         
  pid: string;                        
  status: 'active' | 'inactive';      
  product: string;                     
  inventory?: string[];                
  _id: string;                         
  createdAt: string;                   
  updatedAt: string;                   
  slug: string; 
  viewCount:number;                       
  __v: number;                         
}

interface ProductDiscountClient {
  discountId: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: string;
  disabledAt: string | null; 
}
export interface ProductBrand {
  _id: string;
  name: string;
}
export interface ProductCondition {
  _id: string;
  nameCondition: string;
}
export interface ProductSupplier {
  _id: string;
  name: string;
  address: string;
  phone: number;
  image: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProductType {
  _id: string;
  name: string;
  status: string;
  path: string;
  imgURL: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProductFormat {
  _id: string;
  formats: string;
  status: string;
  disabledAt: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface products {
  _id: string; 
  product_name: string;
  product_description: string;
  product_type: ProductType;
  createdAt: string; 
  product_discount: ProductDiscountClient;
  view: number; 
  product_ratingAvg: number; 
  product_supplier: ProductSupplier;
  product_brand: ProductBrand; 
  product_format: ProductFormat; 
  product_condition: ProductCondition;
  product_quantity: number; 
  product_price: number;
  variants?: ProductVariant[];
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
  limit?: number; 
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  status:string;
  product: string; 
  thumbnail?: FileList; 
  category: string; 
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string; 
}
export interface GetDetailProductResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    _id: string;
    product_name: string;
    product_description: string;
    sku: string;
    pid: string;
    product_type: ProductType;
    product_discount: ProductDiscountClient;
    hasVariants: string;
    product_brand: ProductBrand;
    product_format: ProductFormat;
    product_condition: ProductCondition;
    product_supplier: ProductSupplier;
    variants?: ProductVariant[];
    product_ratingAvg: number;
    product_view: number;
    product_price: number;
    product_price_unit: number;
    weight_g: number;
    image: string[];
    isActive: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    slug?: string;  
    posts:Post
  };
}
export interface GetAllStorageBySlugUrlResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: STORAGE;
}

export interface FilterState {
  storage?: string | null;  
  color?: string | null;
  [key: string]: string | number | null | undefined;
}



  
export interface QueryParamProduct {
  [key: string]: string | number | undefined; 
  storage?: string; 
  color?: string;
  }
  

