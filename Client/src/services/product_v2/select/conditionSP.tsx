import instance from "../../axios";
import { ConditionShopping, SelectConditionShoppingResponse } from "../types";

export const selectConditionShopping = async (): Promise<ConditionShopping[]> => {
  try {
    const response = await instance.get<SelectConditionShoppingResponse>(
      "/product_v2/selectConditionSP"
    );
    return response.data.conditionShoppingList;
  } catch (error) {
    console.error("Lỗi condition shopping:", error);
    throw error;
  }
};
