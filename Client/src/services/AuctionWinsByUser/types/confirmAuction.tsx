export interface User {
  socialLogin: {
    googleId: string;
  };
  noteWarning: string;
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
  createdAt: string;
  updatedAt: string;
  __v: number;
  warning: number;
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
  user: User;
  auctionPricingRange: AuctionPricingRange;
  auctionRound: AuctionRound;
  bidPrice: number;
  confirmationStatus: string;
}

export interface ItemAuction {
  auctionWinner: string;
  auctionStartTime: string;
  auctionEndTime: string;
  price: number;
  totalItemPrice: number;
  auctionPricingRange: string;
  auctionRound: string;
}

export interface ConfirmAuctionResponse {
  auctionWinner: AuctionWin;
  itemAuction: ItemAuction;
  code: string;
  msg: string;
  status: string;
  error: string;
}
