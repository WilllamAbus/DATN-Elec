export interface User {
  _id: string;
  name: string;
  email?: string;
}

export interface Bidder {
  user: User;
  bidPrice: number;
  bidTime: string;
  status: string;
}

export interface GetTop3HighestBidderResponse {
  code: string;
  status: string;
  message: string;
  topBidders: Bidder[];
}
