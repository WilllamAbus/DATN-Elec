// src/types/orderAuctionTypes.ts
// File: src/types/auctions/confirmOrder.ts

export interface ShippingInfo {
    userId: string;
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
  }
  
  export interface OrderAuctionDetail {
    shippingInfo?: ShippingInfo;  // Thay đổi từ shippingInfo bắt buộc sang tùy chọn
    products: Product[];
    orderIds: string // Ví dụ về một thuộc tính khác
  }
  
  // Ví dụ về Product
  export interface Product {
    name: string;
    price: number;
    image: string[];
  }
  
  export interface Interaction {
    user: string;
    orderAuctions: string;
    // item:  null;
    // productID: null;
    productAuction: string;
    type: string;
    score: number;
    status: string;
    isActive: boolean;
    disabledAt: string | null;
    _id: string;
    modifieon: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface Notification {
    user: string;
    message: string;
    type: string;
    orders: string | null;
    customer_service: string | null;
    isRead: boolean;
    stateNotifi: string;
    isActive: boolean;
    status: string;
    disabledAt: string | null;
    _id: string;
    modifieon: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  export interface CompleteOrderDetail {
 
    interactions: Interaction[];
    notification: Notification;
  }
  export interface OrderAuctionResponse {
    success: boolean;
    status: number;
    error: number;
    data: OrderAuctionDetail;
  }
  

  export interface OrderCompleteResponse {
    success: boolean;
    status: number;
    error: number;
    data: CompleteOrderDetail;
  }