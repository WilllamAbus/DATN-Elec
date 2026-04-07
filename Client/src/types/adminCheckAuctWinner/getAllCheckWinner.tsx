// src/types/adminOrder/orderAll.ts
export interface UserID {
    socialLogin: {
        googleId: string;
    };
    _id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    avatar: string;
    status: string;
    disabledAt: string | null;
    tokenLogin: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    address: string;
    birthday: string;
    gender: string;
    phone: string;
    addressID: string;
  }
  
  export interface ShippingAddress {
    userID: UserID;
    name: string;
    phone: string;
    address: string;
    email: string;
    addressID: string;
  }
  
  export interface CheckWinnerAll {
    userWinnerAuct: ShippingAddress;
    _id: string;
    user:string;
    emailSent: boolean;
    serialNumber:number,
    stateOrder: string;
    status: string;
    disabledAt: string | null;
    auctionStatus: string;
    auctionStausCheck:string
    endTime:string
    createdAt: string;
    updatedAt: string;
    bidPrice:number;
    __v: number,
 
  }
  
  
  
  
  
  export interface CheckAuctWinnerResponse {
    status: number;
  message: string;
  
    data: {
    auctWinnerCheck: CheckWinnerAll[];
      totalPages: number;
      currentPage: number;
    };
  }