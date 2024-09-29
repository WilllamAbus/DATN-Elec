// types/orderTypes.ts

export interface OrderProductComplte {
  productId: string
  name: string;
  image: string[];
  totalPrice: number;
  quantity : number,
  shippingFee: number,

  paymentMethod: string
  }
  
  export interface OrderDataComplte {
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
    stateOrder: string,
    products: OrderProductComplte[]
  }
  

  
  // Interface for API response
  export interface ApiResponseComplete {
    success: boolean;
    status: number;
    data: OrderDataComplte[];
  }
  