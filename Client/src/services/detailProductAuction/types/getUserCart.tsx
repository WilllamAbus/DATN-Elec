export interface AuctionWinner {
  _id: string;
  user: string;
  bidPrice: number;
  paymentStatus: string;
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
}

export interface Bid {
  _id: string;
  user: string;
  bidPrice: number;
  bidTime: string;
}

export interface AuctionRound {
  _id: string;
  auctionPricing: string;
  participants: string[];
  bids: Bid[];
  status: string;
}

export interface ItemAuction {
  _id: string;
  auctionWinner: AuctionWinner;
  auctionStartTime: string;
  auctionEndTime: string;
  remainingTime: string;
  quantity: number;
  price: number;
  totalItemPrice: number;
  auctionPricingRange: AuctionPricingRange;
  auctionRound: AuctionRound;
}

export interface Cart {
  _id: string;
  user: string;
  itemAuction: ItemAuction[];
  totalPrice: number;
  stateNotifi: string;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
  items: any[]; 
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetUserCartResponse {
  message: string;
  success: boolean;
  code: number;
  cart?: Cart;
  statusCart?: number;
  error?: string;
  statusWarningTimeout?: boolean;
  timeLimit?: string;
  isBanned?: boolean;
  statusAuction?: string;
  warning?: number;
  noteWarning?: string;
}
