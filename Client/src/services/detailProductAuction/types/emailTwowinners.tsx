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
  statusCode: number;
  emailSent: boolean;
}

export interface EmailTwowinnersResponse {
  code: string;
  status: string;
  message: string;
  topBidders: Bidder[];
}
