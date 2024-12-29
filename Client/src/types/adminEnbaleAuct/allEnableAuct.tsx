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
  
  export interface EnableWinnerAll {
    userWinnerAuct: ShippingAddress;
    _id: string;
  
    serialNumber:number,
 
    status: string;
    disabledAt: string | null;
    auctionStausIsCheck:string
    createdAt: string;
    updatedAt: string;
    bidPriceReturn:number;
    auctionReturnStatus:string | null;
    coundDisabledAuction: number
    __v: number,
 
  }
  
  
  
  
  
  export interface EnableAllResponse {
    status: number;
  message: string;
  
    data: {
        auctWinnerEnable: EnableWinnerAll[];
      totalPages: number;
      currentPage: number;
    };
  }



  export interface EnableWinnerAllSoftDel {
    userWinnerAuct: ShippingAddress;
    _id: string;
  
    serialNumber:number,
 
    status: string;
    disabledAt: string | null;
    auctionStausIsCheck:string
    createdAt: string;
    updatedAt: string;
    bidPriceReturn:number;
    auctionReturnStatus:string | null;
    coundDisabledAuction: number
    __v: number,
 
  }