
export interface Discount {
  _id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  status: string;
  disabledAt: Date | null;
  createdAt: string;
  updatedAt: string;
}

export interface SelectDiscountResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  discounts: Discount[];
}
