// src/types/Checkout.d.ts

export interface OrdersResponse {
  success: boolean;
  data: Order[]; // Array of order objects
  pagination: {
    totalOrders: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface Order {
  _id: string;
  stateOrder: string;
  status: string;
  disabledAt: string | null;
  order_date: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    userID: string;
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
    addressID: string;
  };
}