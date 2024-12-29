// src/types/orderTypes.ts

export interface ShippingInfo {
    userID: string;
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
    addressID: string;
  }
  
  export interface Product {
    productName: string;
    quantity: number;
    productPrice:number;
    image: string;
  }
  
  export interface StatusCheckAuctWinner {
   userInforWinner?: ShippingInfo;  // Thay đổi từ shippingInfo bắt buộc sang tùy chọn
     productDetails: Product;
     state: string, 
    
     winnerPrice: string ,
     auctionWinnerid: string,
     date:string,
  }