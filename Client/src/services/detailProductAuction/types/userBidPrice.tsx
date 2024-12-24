export interface UserBidPrice {
  user: string;
  bidPrice: number;
  auctionPricingRange: string;
}

export interface UserBidPriceResponse {
  newPrice?: number;
  success: boolean;
  err: number;
  msg: string;
  status: string;
  userId?: string
}