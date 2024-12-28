export interface ShippingInfo {
    userId: string;
    recipientName: string;
    phone: string;
    address: string;
    email: string;
  }


  
  export interface AuctionEnableDetailsAdmin {
    userInforWinner?: ShippingInfo;  // Thay đổi từ shippingInfo bắt buộc sang tùy chọn
    productDetails: Product;
    state: string, 
    countDisabled: number,
    winnerPrice: string ,
    auctionWinnerid: string,
    date:string,
   
  }
  
  // Ví dụ về Product
  export interface Product {
    productName: string;
    quantity: number;
    productPrice:number;
    image: string;
  }

  export interface EnableAuctDetailAdminResponse {
    success: boolean;
    status: number;
    error: number;
    data: AuctionEnableDetailsAdmin;
  }