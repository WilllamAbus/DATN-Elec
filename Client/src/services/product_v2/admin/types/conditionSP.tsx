
export interface ConditionShopping {
  _id: string;
  nameCondition: string;
  status: string;
  disabledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SelectConditionShoppingResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  conditionShoppingList: ConditionShopping[];
}
