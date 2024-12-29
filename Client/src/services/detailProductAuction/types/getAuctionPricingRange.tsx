export interface AuctionPricingRangeResponse {
  code: string;
  status: string;
  msg: string;
  auctionPricing: AuctionPricing;
}
export interface AuctionPricing {
  _id: string;
  startTime: string;
  endTime: string;
  startingPrice: number;
  maxPrice: number;
  currentPrice: number;
  priceStep: number;
  status: string;
  product_randBib: string;
  isPriceStepAdjusted:boolean;
}

