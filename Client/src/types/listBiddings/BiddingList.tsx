

/** Interface for a single product in the bidding history */
export interface Product {
  productId: string;
  productName: string;
  slug: string;
  image: string;
  status: string;
}

/** Interface for pagination details */
export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Interface for the response of user bidding history */
export interface BiddingHistoryResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    products: Product[];
    pagination: Pagination;
  };
}

/** Interface for a single bidding detail in user bidding details */
export interface UserBiddingDetail {
  auctionRoundId: string;
  bidPrice: number;
  bidTime: string;
}

/** Interface for product details in bidding details */
export interface ProductDetails {
  id: string;
  productName: string;
  slug: string;
}

/** Interface for the response of user bidding details */
export interface BiddingDetailsResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    productDetails: ProductDetails;
    userBiddingDetails: UserBiddingDetail[];
  };
}

/** Interface for the generic bidding response */
export interface BiddingResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
}
