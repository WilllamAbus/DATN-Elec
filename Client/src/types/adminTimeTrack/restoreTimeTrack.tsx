export interface ProductDeleted {
    _id: string;
    product_name: string;
    image: string[];

  }
  
  export interface TimeTrackRestore {
    _id: string;
    productId: string;
    startTime: string;
    endTime: string;
    stateTime: string;
 
  }