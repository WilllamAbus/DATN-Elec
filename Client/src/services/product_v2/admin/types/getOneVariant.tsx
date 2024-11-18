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
  _id: string;
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
  image?: Image[];                   
  sku: string;                         
  pid: string;                        
  status: 'active' | 'inactive';      
  product: string;                     
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
  productVariant: ProductVariant;
}
