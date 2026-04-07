// src/types/bidTypes.ts

export interface BidData {
    product_bidding: {
      productId: string;
      product_name: string;
    };
    bidder: string;
    bidAmount: number;
    bidTime: string; // ISO 8601 string for date-time
    biddingQuantity: number;
    priceRange: string;
    stateBidding: string;
    bidEndTime: string; // ISO 8601 string for date-time
    status: string;
    disabledAt: string | null;
    _id: string;

    __v: number;
  }
  
  export interface BidResponse {
    success: boolean;
    status: number;
    error: string;
    data: BidData;
  }
  
  // GetBid

export interface Product {
    _id: string;
    product_name: string;
    image: string[];
    product_price_unit: number;
  }
  
  export interface Bid {
    _id: string;
    product_bidding: {
      productId: Product;
      product_name: string;
    };
    bidder: string;
    bidAmount: number;
    bidTime: string;
    bidEndTime: {
      _id: string;
      endTimeBid: string;
    };
    biddingQuantity: number;
    priceRange: {
      _id: string;
      minBid: number;
      midBid: number;
      maxBid: number;
    };
    stateBidding: string;
    isActive: boolean;
    status: string;
    disabledAt: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    productId?: string; 
    serviceRequestId: string;
    amount?: number
    timeLeft: number;
  }
  
  export interface BidsState {
    totalBids: number;
    bids: Bid[];
  }
  

  /*UpdatBid*/ 

  export interface UpdateBidData {
    product_bidding: {
        productId: string;
        product_name: string;
      };
      bidder: string;
    bidAmount: number;
    bidTime: string; // ISO 8601 string for date-time
    biddingQuantity: number;
    priceRange: string;
    stateBidding: string;
    bidEndTime: string; // ISO 8601 string for date-time
    status: string;
    disabledAt: string | null;
    _id: string;

    __v: number;
}
  export interface UpdateBidAmountRequest {
    productId: string;
    bidAmount: number;
    userId: string;
}

export interface UpdateBidAmountResponse {
    success: boolean;
    status: number;
    message: string;
    data: UpdateBidData; // Use the specific type
}



export interface Service {
  _id: string;
  service_name: string;
  description: string;
  stateNoti: string;
  isActive: boolean;
  status: string;
  serviceOpenDate: string;
  disabledAt: string | null;
  isOpenDate: string;
  modifieon: string;
  createdAt: string;
  updatedAt: string;
  serrvice_slug: string;
}
