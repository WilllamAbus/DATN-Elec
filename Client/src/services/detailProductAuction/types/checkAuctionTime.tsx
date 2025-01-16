export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Bidder {
  user: User;
  bidPrice: number;
  status: string;
  statusCheckAuctionTime: number;
}

export interface Product {
  name: string;
  slug: string;
  status: string;
}

export interface CheckAuctionTimeResponse {
  code: string;
  case?: number;
  status: string;
  message: string;
  product: Product;
  bidders: Bidder[];
}
