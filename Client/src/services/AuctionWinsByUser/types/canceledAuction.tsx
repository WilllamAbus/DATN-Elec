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
  disabledAt: Date | string;
  tokenLogin: string;
  roles: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
  address: string;
  birthday: Date | string;
  gender: string;
  phone: string;
  addressID: string;
  addresses: any[];
  banks: any[];
  socialLogin: SocialLogin;
  warning: number;
  noteWarning: string;
  messgese?: string;
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
  product_randBib: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  auctionPriceHistory: string;
}

export interface AuctionRound {
  _id: string;
  auctionPricing: string;
  participants: string[];
  bids: Array<{
    user: string;
    bidPrice: number;
    bidTime: string;
    _id: string;
  }>;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
export interface UserWarningInfo {
  id: string;
  warning: number;
  noteWarning: string;
  status: string;
  disabledAt: Date | string;
}

export interface AuctionCanceledResponse {
  code: string;
  msg: string;
  status: string;
  error: string | null;
  data: {
    auctionWinner: AuctionWin;
    user: UserWarningInfo;
  };
}
