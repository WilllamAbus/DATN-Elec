export interface AuctionPricing {
  _id: string;
  startTime: Date;
  endTime: Date;
  remainingTime: string;
  startingPrice: number;
  maxPrice: number;
  currentPrice: number;
  priceStep: number;
  status: string;
  hasWinner: boolean;
}

export interface CheckAuctionTimeAuctionPricingRangeResponse {
  success: boolean;
  code: string;
  msg: string;
  status: number;
  error?: string;
  statusOutOfTimeAuctionPricingRange: boolean;
  statusCheckAuctionTimeAuctionPricingRange: number;
  remainingTime?: string;
  auctionPricing?: AuctionPricing;
}
