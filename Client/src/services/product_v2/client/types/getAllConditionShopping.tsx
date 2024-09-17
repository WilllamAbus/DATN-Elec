
export interface ConditionShopping {
  _id: string;
  nameCondition: string;
  status: string;
  disabledAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetAllConditionShoppingResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  conditionShopping: ConditionShopping[];
  error?: string;
}
