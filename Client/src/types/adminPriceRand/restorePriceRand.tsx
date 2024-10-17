export interface ProductRandBib {
    productId: string;
    product_price_unit: number;
    product_name: string;
    product_format: string;
  }
  
  export interface PriceRangeRestore {
    _id: string;
    product_randBib: ProductRandBib;
    minBid: number;
    midBid: number;
    maxBid: number;
    bidInput: number;
    status: string;
    disabledAt: string; // ISO Date string
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    __v: number;
 
  }
  