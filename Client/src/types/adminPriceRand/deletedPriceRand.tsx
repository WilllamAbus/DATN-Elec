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
  
  export interface ProductRandBibDeleted {
    productId: string;
    product_price_unit: number;
    product_name: string;
    product_format: string;
  }
  
  export interface PriceRangeDeleted {
    _id: string;
    product_randBib: ProductRandBibDeleted;
    minBid: number;
    midBid: number;
    maxBid: number;
    bidInput: number;
    product: Product;
  }
  
  export interface PriceRangeResponseDeleted {
    success: boolean;
    message: string;
    data: {
    priceRanges: PriceRangeDeleted[];
      totalPages: number;
      currentPage: number;
    };
  }
  