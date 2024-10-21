// src/types/timeTrack.ts
export interface ProductFormat {
    _id: string;
    formats: string;
  }
  
  export interface ProductDeleted {
    _id: string;
    product_name: string;
    image: string[];
    product_format: ProductFormat;
  }
  
  export interface TimeTrackDeleted {
    _id: string;
    productId: string;
    startTime: string;
    endTime: string;
    stateTime: string;
    product: ProductDeleted;
  }
  
  export interface TimeTrackResponseDeleted {
    status: number;
    message: string;
    data: {
      timeTracks: TimeTrackDeleted[];
      totalPages: number;
      currentPage: number;
    };
  }
  