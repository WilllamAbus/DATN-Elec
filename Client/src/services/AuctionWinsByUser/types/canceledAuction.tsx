export interface SocialLogin {
  googleId: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  avatar: string;
  status: string;
  disabledAt: Date | string;
  tokenLogin: string;
  roles: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
  address: string;
  birthday: Date | string;
  gender: string;
  phone: string;
  addressID: string;
  addresses: any[];
  banks: any[];
  socialLogin: SocialLogin;
  warning: number;
  noteWarning: string;
  messgese?: string;
}

export interface AuctionWinner {
  id: string;
  user: User;
  confirmationStatus: string;
  status: string;
  auctionStatus: string;
}

export interface UserWarningInfo {
  id: string;
  warning: number;
  noteWarning: string;
  status: string;
  disabledAt: Date | string;
}

export interface AuctionCanceledResponse {
  code: string;
  msg: string;
  status: string;
  error: string | null;
  data: {
    auctionWinner: AuctionWinner;
    user: UserWarningInfo;
  };
}
