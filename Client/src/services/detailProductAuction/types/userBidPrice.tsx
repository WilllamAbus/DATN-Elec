export interface UserBidPrice {
  user: string;
  bidPrice: number;
  auctionPricingRange: string;
}
export interface AuctionPricing {
  currentPrice: number;
  maxPrice: number;
  priceStep: number;
}
export interface UserBidPriceResponse {
  newPrice?: number;
  success: boolean;
  err: number;
  msg: string;
  status: string;
  userId?: string;
  userStatus?: string;
  redirectUrl?: string;
  auctionPricing?: AuctionPricing;
}