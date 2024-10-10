// src/types/orderTypes.ts

export interface ShippingAddress {
    userID: string;
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
    addressID: string;
  }
  
  export interface Product {
    image: string[];
    name: string;
    price: number;
  }
  
  export interface Order {
    _id: string;
    stateOrder?: string;
    status: string;
    shippingAddress: ShippingAddress;
    products: Product[];
    order_date: string; // ISO date string
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
    totalPrice: number;
  }
  