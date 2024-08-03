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
  }
  