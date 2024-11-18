
export interface Discount {
  _id: string;
  code: string;
  discountPercent: number;

}

export interface SelectDiscountResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  selectDiscounts: Discount[];
}
