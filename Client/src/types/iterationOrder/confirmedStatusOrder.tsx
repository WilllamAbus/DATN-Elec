export interface OrderProductConfirmed {
    productId: string
      name: string;
      image: string[];
      totalPrice: number;
      quantity : number,
      shippingFee: number,
  
      paymentMethod: string
    }
  
    export interface OrderDataAllConfirmed {
      _id:string,
      orderId:string,
      userId:string
      recipientName: string;
      phoneNumber: string;
      address: string;
      email: string;
      stateOrder: string
      products: OrderProductConfirmed []; // Array of products
    }
    
  //   export interface OrderResponseAll {
  //     success: boolean;
  //     status: number;
  //     error?: number; // Assuming error can be a number
  //     orders: OrderDataAll[];
  //     totalPrice: number;
  // }
    
    // Interface for API response
    export interface ApiResponseConfirmed {
      success: boolean;
      status: number;
      data: OrderDataAllConfirmed[]
    }
    