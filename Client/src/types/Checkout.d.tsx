// src/types/orderTypes.ts
export interface OrderProduct {
    product: string; // ObjectId reference to the products model
    name: string; // Product name
}

export interface OrderUser {
    user: string; // ObjectId reference to the users model
    email: string; // User email
}

export interface OrderShipping {
    name: string;
    address: string;
    city: string;
    sdt: string;
    formatShipping: {
        type: string;
        price: number;
    };
}

export interface PaymentDetails {
    method: string; // Payment method (e.g., 'credit_card', 'paypal')
    details: string; // Additional payment details
}

export interface OrderData {
    _id?: string;
    payment?: PaymentDetails;
    quantityShopping?: Number;
    totalPrice?: Number;
    userId?: OrderUser[];
    products?: OrderProduct[];
    shipping?: OrderShipping;
    status?: string; // Default value 'active'
}


