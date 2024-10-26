// src/types/timeTrack.ts
export interface ProductFormat {
    _id: string;
    formats: string;
  }
  
  export interface Product {
    _id: string;
    product_name: string;
    image: string[];
    product_format: ProductFormat;
  }
  
  export interface TimeTrack {
    _id: string;
    productId: string;
    startTime: string;
    endTime: string;
    endTimeBid: string;
    stateTime: string;
    status:  string
    product: Product;
  }
  
  export interface TimeTrackResponse {
    status: number;
    message: string;
    data: {
      timeTracks: TimeTrack[];
      totalPages: number;
      currentPage: number;
    };
  }
  