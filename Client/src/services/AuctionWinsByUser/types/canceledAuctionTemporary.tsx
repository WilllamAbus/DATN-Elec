
export interface User {
  _id: string;
  name: string;
  email: string;
  noteWarning: string;
  warning: number;
  status?: string;
  disabledAt?: string;
  messgese?: string;
  updatedAt?: string;
}

export interface AuctionWinner {
  id: string;
  user: User;
  confirmationStatus: string;
  status: string;
  auctionStatus: string;
}

export interface CanceledAuctionTemporaryResponse {
  code: string;
  msg: string;
  status: string;
  error: string | null;
  data: {
    auctionWinner: AuctionWinner;
    user: {
      id: string;
      warning: number;
      noteWarning: string;
      status?: string;
      disabledAt?: string;
      messgese?: string;
    }
  };
}
