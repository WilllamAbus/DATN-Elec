// src/types/Product.ts
export interface Product {
    _id: string;
    product_name: string;
    product_price_unit: number;
    image: string[];
  }
  
  export interface PriceRandResponseAdd {
    status: number;
    message: string;
    data: Product[];
  }


  export interface PriceRandData {
   
    bidInput?: string;  // Optional string to allow either endTime or endTimeBid to be null
    // Similar to endTime
  }