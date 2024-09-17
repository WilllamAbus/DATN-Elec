// types/auction.ts
// src/types/auction.ts
export interface OrderDataType {
  userId: string;              // User ID of the person placing the order
  auctionDetails: string;           // Auction ID of the item being ordered
  payment: string;             // Payment method ('Cash' or 'MoMo')
  // amount: number;              // Total price or amount of the order
  // shippingAddress?: string;    // Optional shipping address
  // phoneNumber?: string;        // Optional contact phone number
}

export interface AuctionItem {
    id: string;
    image: string;
    name: string;
    amount: number;
  }
  export interface OrderResponse {
    success: boolean;
    status: number;
    message: string;
    data: {
      orderAuctionID: string;
      orderDetailAuctionID: string;
      hashLinkPayment?: string;
    };
  }
  export interface AuctionData {
    auctionTotal: number;
    auctionQuantity: number;
    productName: string;
    productImages: string[];
    userAddress: string;
    userName: string;
    userSdt: string;
    auctionTime: string;
    auctionEndTime: string;
    biddings: string[];
    stateAuction: string;
    auctionId:string
  }
  
  export interface FormData {
    payment: string;
  }
  
  