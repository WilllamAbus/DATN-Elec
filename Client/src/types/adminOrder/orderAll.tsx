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





export interface OrderResponse {
  status: number;
message: string;

  data: {
    ordersDeleted: Order[];
    totalPages: number;
    currentPage: number;
  };
}

