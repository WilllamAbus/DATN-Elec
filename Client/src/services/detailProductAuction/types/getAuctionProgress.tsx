export interface User {
  _id: string;
  name: string;
}

export interface Bid {
  _id: string;
  user: User;
  bidPrice: number;
  bidTime: string;
}

export interface ProductDetails {
  id: string;
  productName: string;
  slug: string;
}

export interface Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetAuctionProgressResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  timestamp: string;
  statusCode: number;
  data: {
    productDetails: ProductDetails;
    biddingList: Bid[];
    pagination: Pagination;
  };
}


