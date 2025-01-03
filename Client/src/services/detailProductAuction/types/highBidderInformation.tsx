export interface HighBidderInformationResponse {
  code: string;
  status: string;
  msg: string;
  data: AuctionData;
}

export interface AuctionData {
  userName: string;
  startTime: string; 
  endTime: string; 
  remainingTime: string;
  bidPrice: number;
}
