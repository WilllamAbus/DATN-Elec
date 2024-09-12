// src/types/randBidTypes.ts


  
// types/timeTrackProduct/randBidPrice.ts
// Update your RandBid type definition to include productId
export interface RandBid {
  productId: string;
  minBid: number;
  midBid: number;
  maxBid: number;

}



  
  export interface RandBidResponse {
    success: boolean;
    status: number;
    data: RandBid[];
  }
  