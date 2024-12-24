export interface Product {
    _id: string;
    image: string[];
    product_name: string;
  }
  

  export interface PriceRangeDeletedAuct {
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
  
  export interface PriceRangeResponseDeleted {
    success: boolean;
    message: string;
    data: {
        priceRangesDeleted: PriceRangeDeletedAuct[];
      totalPages: number;
      currentPage: number;
    };
  }


  export interface PriceRangeRestoreAuct {
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


  export interface PriceRangeDelAuct {
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