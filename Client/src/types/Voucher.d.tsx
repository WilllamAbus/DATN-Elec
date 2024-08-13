// types.ts
export interface Category {
    _id: string;
    name: string;
  }
  
  export interface Voucher {
    _id: string;
    code: string;
    voucherNum: number;
    expiryDate: string; // ISO date string
    isActive: boolean;
    cateReady: Category[];
    conditionActive: string;
    status: string;
  }
  

  export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imgPreview: string;
  }
  
  export  interface CartState {
    items: CartItem[];
    totalPrice: number;
    shipping: number;
    applyVoucher: boolean;
    selectedVoucher?: Voucher;
    // email: string,
    // roles:string
  }