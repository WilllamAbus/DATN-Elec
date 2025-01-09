export interface CheckAuctionTimeAuctionPricingRangeResponse {
  success: boolean;
  code: string;
  msg: string;
  status: number;
  error?: string;
  statusOutOfTimeAuctionPricingRange: boolean;
  statusCheckAuctionTimeAuctionPricingRange: number;
  remainingTime?: string; 
}
