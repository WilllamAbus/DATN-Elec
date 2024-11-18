
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
  disabledAt: string | null;
  variants: string[];
  comments: any[];
  product_attributes: any[]; 
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
  _id: string;
  variant_name: string;                
  variant_description: string;         
  variant_price: number;   
  product_discount: Discount;   
  variant_original_price:number;                
  battery: BATTERY[];                    
  color: COLOR[];                   
  cpu: CPU[];                     
  graphicsCard: GRAPHICSCARD[];             
  operatingSystem: OPERATINGSYSTEM[];          
  ram: RAM[];                    
  screen: SCREEN[];                   
  storage: STORAGE[];                    
  image?: Image[];                   
  sku: string;                         
  pid: string;                        
  status: 'active' | 'inactive';                       
  inventory?: string[];                                      
  createdAt: string;                   
  updatedAt: string;                   
  slug: string;   
                       
                  
}
export interface Image {
  _id: string;
  image: string[];
  color: string; 
  slug: string;
}

export interface ApiResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  variant: ProductVariant | undefined;      
}