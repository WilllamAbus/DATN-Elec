export interface Address {
  fullName: string;
  address: string;
  addressID: string;
  phone: string;
  isDefault: boolean;
  _id: string;
}

export interface Bank {
  name: string;
  fullName: string;
  accountNumber: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: boolean;
  lookupSupported: boolean;
  support: number;
  isTransfer: boolean;
  swift_code: string;
  isDefault: boolean;
  _id: string;
}

export interface User {
  socialLogin: {
    googleId: string;
  };
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  avatar: string;
  status: string;
  disabledAt: string | null;
  tokenLogin: string;
  roles: string[];
  addresses: Address[];
  banks: Bank[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  noteWarning: string;
  statusAuction: string;
  warning: number;
  birthday: string;
  gender: string;
  phone: string;
  timelimit: number;
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
  isPriceStepAdjusted: boolean;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  currentPriceTemporarily: number;
  endTimeTemporarily: string;
  startTimeTemporarily: string;
  auctionPriceHistory: string;
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
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuctionWinner {
  id: string;
  user: User;
  auctionPricingRange: AuctionPricingRange;
  auctionRound: AuctionRound;
  bidPrice: number;
  confirmationStatus: string;
}

export interface ItemAuction {
  auctionWinner: AuctionWinner;
}

export interface ConfirmAuctionTemporaryAuctionResponse {
  code: string;
  msg: string;
  status: string;
  error: string | null;
  data: {
    auctionWinner: AuctionWinner;
    itemAuction: ItemAuction;
  };
}
