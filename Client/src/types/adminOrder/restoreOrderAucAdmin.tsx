export interface ShippingAddress {
    userID: string;
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
    addressID: string; // or create a more specific type for addressID if needed
  }
  
  export interface OrderRestore {
    _id: string;
    stateOrder: string;
    status: string;
    disabledAt: string | null;
    order_date: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    shippingAddress: ShippingAddress;
  }
  
  export interface RestoreOrderResponse {
    success: boolean;
    status: number;
    data: OrderRestore;
  }