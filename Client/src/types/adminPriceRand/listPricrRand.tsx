// types/auctionTypes.ts
export interface ProductFormat {
    _id: string;
    formats: string;
  }
  
  export interface Product {
    _id: string;
    image: string[];
    product_format: ProductFormat;
  }
  
  export interface ProductRandBib {
    productId: string;
    product_price_unit: number;
    product_name: string;
    product_format: string;
  }
  
  export interface PriceRange {
    _id: string;
    product_randBib: ProductRandBib;
    minBid: number;
    midBid: number;
    maxBid: number;
    bidInput: number;
    product: Product;
  }
  
  export interface PriceRangeResponse {
    success: boolean;
    message: string;
    data: {
    priceRanges: PriceRange[];
      totalPages: number;
      currentPage: number;
    };
  }
  