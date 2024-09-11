export interface RandBid {
    productId: string;
    minBid: number;
    midBid: number;
    maxBid: number;
  
  }
  
  
  
    
    export interface RandBidResponseV2 {
      success: boolean;
      status: number;
      data: RandBid[];
    }
    