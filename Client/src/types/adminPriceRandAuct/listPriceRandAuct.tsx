export interface Product {
    _id: string;
    image: string[];
    product_name: string;
  }
  

  export interface PriceRange {
    serialNumber: number;
    _id: string;
    product_randBib: string;
    startTime: string;
    endTime: string;
    startingPrice:number;
    maxPrice: number;
    currentPrice: number;
    priceStep: number;
    status: string;
    product: Product;
  }
  
  export interface PriceRangeResponse {
    success: boolean;
    message: string;
    data: {
      priceRangesAuct: PriceRange[];
      totalPages: number;
      currentPage: number;
    };
  }


  export interface PriceRangeAuctSoftDel {
    serialNumber: number;
    _id: string;
    product_randBib: string;
    startTime: string;
    endTime: string;
    startingPrice:number;
    maxPrice: number;
    currentPrice: number;
    priceStep: number;
    status: string;
    product: Product;
  }