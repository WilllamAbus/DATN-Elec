// types/auctionTypes.ts

  
  export interface Product {
    _id: string;
    image: string[];

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
    status: string;
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
  