export interface Product {
  _id: string;
  slug: string;
}

export interface VariantImage {
  _id: string;
  image: string[];
  color: string;   
}

export interface ProductDiscount {
  _id: string;
  code: string;
  discountPercent: number;
}

export interface SCREEN {
  _id: string;
  name: string;
}

export interface CPU {
  _id: string;
  name: string;
}

export interface RAM {
  _id: string;
  name: string;
}

export interface COLOR {
  _id: string;
  name: string;
}

export interface GRAPHICSCARD {
  _id: string;
  name: string;
}

export interface BATTERY {
  _id: string;
  name: string;
}

export interface OPERATINGSYSTEM {
  _id: string;
  name: string;
}

export interface STORAGE {
  _id: string;
  name: string;
}

export interface ProductVariant {
  _id: string;
  variant_name: string;
  variant_price: number;
  variant_original_price: number;
  product_discount: ProductDiscount;
  battery: string;             
  color: COLOR;       
  cpu: CPU;                
  operatingSystem: OPERATINGSYSTEM; 
  ram: RAM;                
  screen: SCREEN;            
  storage: STORAGE;          
  image: VariantImage[];        
  sku: string;               
  pid: string;              
  status: string;              
  product: Product;           
  inventory: any[];              
  viewCount: number;       
  lastViewed: string;             
  slug: string;               
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetPhoneVariantsResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    category: string;
    variants: ProductVariant[];
  };
  pagination: Pagination;
}