export interface SocialLogin {
  googleId: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  avatar: string;
  status: string;
  disabledAt: string | null;
  tokenLogin: string;
  roles: string[];
  addresses: any[];
  banks: any[];
  socialLogin: SocialLogin;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuctionBid {
  user: string;
  bidPrice: number;
  bidTime: string;
  _id: string;
}

export interface AuctionRound {
  _id: string;
  auctionPricing: string;
  participants: string[];
  bids: AuctionBid[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  createdAt: string;
  updatedAt: string;
  __v: number;
  auctionPriceHistory: string;
}

export interface AuctionWin {
  _id: string;
  auctionPricingRange: AuctionPricingRange;
  auctionRound: AuctionRound;
  user: User;
  bidPrice: number;
  paymentStatus: string;
  auctionStatus: string;
  status: string;
  confirmationStatus: string;
  auctionStausCheck: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  remainingTime: string; 
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AuctionWinsResponse {
  code: string;
  msg: string;
  data: AuctionWin[];
  pagination: Pagination;
  total:number
}
