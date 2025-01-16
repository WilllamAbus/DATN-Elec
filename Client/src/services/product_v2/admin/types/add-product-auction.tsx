export interface reponseProduct {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  product?: ProductAuction;
  error?: string;
}
export interface AuctionPricing {
  _id: string;
  startTime: string;  
  endTime: string;   
  startingPrice: number; 
  maxPrice: number;     
  currentPrice: number;   
  priceStep: number;     
  status: 'active' | 'inactive' | 'completed' | 'canceled'; 
  product_randBib: string; 
  isPriceStepAdjusted: boolean;
  emailSent: boolean;  
  createdAt: string;  
  updatedAt: string;  
      
}
export interface ProductAuction {
  _id: string;
  product_name: string;
  product_description: string;
  product_type: string;
  product_discount: number;
  product_brand: string;
  product_condition: string;
  product_supplier: string;
  product_ratingAvg: number;
  product_view: number;
  product_price_unit?: number;
  weight_g: number;
  isActive: boolean;
  status: 'active' | 'inactive';
  disabledAt?: Date | null;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  product_slug: string;
  image?: FileList;
  auctionPricing?: AuctionPricing;
}

export interface ProductDiscount {
  discountId: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: 'active' | 'inactive';
  disabledAt?: Date | null;
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


export interface ProductState {
  products: ProductAuction[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}


export const initialProductState: ProductState = {
  products: [],
  status: "idle",
  error: null,
  isLoading: false,
};
export interface Comment {
  _id: string;
  text: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}
