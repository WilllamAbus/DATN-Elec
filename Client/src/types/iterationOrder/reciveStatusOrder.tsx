// types/orderTypes.ts

export interface OrderProductRecive {
  productId: string
    name: string;
    image: string[];
    totalPrice: number;
    quantity : number,
    shippingFee: number,

    paymentMethod: string
  }
  
  export interface OrderDataRecive {
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
    stateOrder: string
    products: OrderProductRecive[]; // Array of products
  }
  

  
  // Interface for API response
  export interface ApiResponseReceve {
    success: boolean;
    status: number;
    data: OrderDataRecive[]
  }
  

  // types/orderTypes.ts

// types/orderTypes.ts

  