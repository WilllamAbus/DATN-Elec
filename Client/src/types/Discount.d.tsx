// types.ts
export interface Category {
    _id: string;
    name: string;
  }
  
  export interface Discount {
    _id: string;
    code: string;
    discountPercentage: number;
    expiryDate: string; // ISO date string
    isActive: boolean;
    cateReady: Category[];
    conditionActive: string;
  }
  