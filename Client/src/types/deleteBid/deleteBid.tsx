// biddingTypes.ts
export interface DeleteBiddingRequest {
    userId: string;
    biddingId: string;
    serviceRequestId: string;
    reason: string;
    notes: string;
  }
  
  export interface AuctionResult {
    product_bidding: {
      productId: string;
      product_name: string;
    };
    _id: string;
    bidder: string;
    bidAmount: number;
    bidTime: string;
    bidEndTime: string;
    biddingQuantity: number;
    priceRange: string;
    stateBidding: string;
    isActive: boolean;
    status: string;
    disabledAt: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BiddingState {
    auction: AuctionResult | null;
    loading: boolean;
    error: string | null;
  }
  