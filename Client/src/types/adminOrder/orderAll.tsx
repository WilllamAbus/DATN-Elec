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
  recipientName: string;
  phoneNumber: string;
  address: string;
  email: string;
  addressID: string;
}

export interface Order {
  shippingAddress: ShippingAddress;
  _id: string;
  stateOrder: string;
  status: string;
  disabledAt: string | null;
  order_date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Data {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
}

export interface Pagination {
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OrderResponse {
  orders: Order[];
  pagination: {
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
