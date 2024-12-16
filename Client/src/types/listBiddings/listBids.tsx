export interface Product {
  _id: string;
  product_name: string;
  image: string[];
}

export interface RandPriceObj {
  _id: string;
  minBid: number;
  midBid: number;
  maxBid: number;
}

export interface BiddingUserObj {
  _id: string;
  name: string;
}

export interface ProductBidding {
  productId: string;
  product_name: string;
}

export interface Bidding {
  _id: string;
  product_bidding: ProductBidding;
  bidder: string;
  bidAmount: number;
  bidTime: string; // ISO date string
  bidEndTime: string;
  priceRange: string;
  status: string;
  product: Product;
  randPriceObj: RandPriceObj;
  biddingUserObj: BiddingUserObj;
}

export interface BiddingResponse {
  success: boolean;
  data: {
    Bidding: Bidding[];
    totalPages: number;
    currentPage: number;
  };
}


export interface BiddingResponseActive {
  success: boolean;
  data: {
    biddingActive: Bidding[];
    totalPages: number;
    currentPage: number;
  };
}
