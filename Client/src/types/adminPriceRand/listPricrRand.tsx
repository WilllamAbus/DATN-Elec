// types/auctionTypes.ts

  
  export interface Product {
    _id: string;
    image: string[];
  
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
    status: string;
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
  