export interface User {
  _id: string;
  name: string;
}

export interface BiddingItem {
  _id: string;
  user: User;
  bidPrice: number;
  bidTime: string;
}

export interface Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductDetails {
  id: string;
  productName: string;
  slug: string;
}

export interface BiddingListResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    productDetails: ProductDetails;
    biddingList: BiddingItem[];
    pagination: Pagination;
  };
}
