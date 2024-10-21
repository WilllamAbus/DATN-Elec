// src/types/timeTrack.ts

  
  export interface ProductDeleted {
    _id: string;
    product_name: string;
    image: string[];
 
  }
  
  export interface TimeTrackDeleted {
    _id: string;
    productId: string;
    startTime: string;
    endTime: string;
    stateTime: string;
    status:  string
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
  