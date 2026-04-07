export interface Product {
    _id: string;
    product_name: string;
    image: string[];
  
  }
  
  export interface TimeTrackSoftDel {
    _id: string;
    productId: string;
    startTime: string;
    endTime: string;
    endTimeBid: string;
    stateTime: string;
 
  }