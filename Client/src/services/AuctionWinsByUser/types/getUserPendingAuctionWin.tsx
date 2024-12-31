export interface ProductRandBib {
  _id: string;
  product_name: string;
}

export interface AuctionPricingRange {
  _id: string;
  startTime: string;
  endTime: string;
  startingPrice: number;
  maxPrice: number;
  currentPrice: number;
  priceStep: number;
  status: string;
  product_randBib: ProductRandBib;
  isPriceStepAdjusted: boolean;
  createdAt: string;
  updatedAt: string;
  auctionPriceHistory: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Bid {
  user: string;
  bidPrice: number;
  bidTime: string;
  _id: string;
}

export interface AuctionRound {
  _id: string;
  auctionPricing: string;
  participants: string[];
  bids: Bid[];
  status: string;
}

export interface AuctionWinner {
  _id: string;
  auctionPricingRange: AuctionPricingRange;
  auctionRound: AuctionRound;
  user: User;
  bidPrice: number;
  paymentStatus: string;
  auctionStatus: string;
  status: string;
  auctionStausCheck: string;
  confirmationStatus: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  noteAuctionWinner: string;
  warning?: number; 
  messgese?: string; 
}


export interface AuctionWinResponse {
  code: string;
  msg: string;
  data: AuctionWinner[];
}
