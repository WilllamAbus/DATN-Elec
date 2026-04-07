// src/types/Product.ts
export interface Product {
    _id: string;
    product_name: string;
    image: string[];
  }
  
  export interface ProductResponseAdd {
    status: number;
    message: string;
    data: Product[];
  }
  


  export interface TimeTrackData {
  
    endTime?: string;  // Optional string to allow either endTime or endTimeBid to be null
    endTimeBid?: string;  // Similar to endTime
  }
  