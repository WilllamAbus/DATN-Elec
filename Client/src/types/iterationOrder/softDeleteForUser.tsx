// src/types/softDeleteOrder.ts
export interface DeleteOrderItearacRequest {
  userId: string;
  orderId: string;
  serviceRequestId: string;
  reason: string;
  notes: string;
}
export interface SocialLogin {
  googleId: string;
}

export interface UserID {
  socialLogin: SocialLogin;
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

export interface SoftDeleteOrderData {
  shippingAddress: ShippingAddress;
  _id: string;
  stateOrder: string;
  status: string;
  disabledAt: string;
  order_date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SoftDeleteOrderResponse {
  success: boolean;
  status: number;
  message: string;
  data: SoftDeleteOrderData;
}