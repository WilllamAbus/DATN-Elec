
export interface ConditionShopping {
  _id: string;
  nameCondition: string;
}

export interface SelectConditionShoppingResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  selectConditionShopping: ConditionShopping[];
}
