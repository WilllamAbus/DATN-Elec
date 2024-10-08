// types/orderTypes.ts

export interface OrderProductAll {
  productId: string
    name: string;
    image: string[];
    totalPrice: number;
    quantity : number,
    shippingFee: number,

    paymentMethod: string
  }

  export interface OrderDataAll {
    orderId:string
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
    stateOrder: string
 
    products: OrderProductAll[]; // Array of products
  }
  
//   export interface OrderResponseAll {
//     success: boolean;
//     status: number;
//     error?: number; // Assuming error can be a number
//     orders: OrderDataAll[];
//     totalPrice: number;
// }
  
  // Interface for API response
  export interface ApiResponseAll {
    success: boolean;
    status: number;
    data: OrderDataAll[]
  }
  