export interface User {
  _id: string;
  name: string;
  email?: string; 
}

export interface Bidder {
  user: User;
  bidPrice: number;
  status: string;
  statusCode: number;
}

export interface Product {
  name: string;
  slug: string;
  currentPrice: number;
  maxPrice: number;
  auctionEndTime: string;
}

export interface CheckStatusAuctionPricingRangeResponse {
  code: string;
  status: string;
  message: string;
  showModal: boolean;
  product: Product;
  bidders: Bidder[];
}
