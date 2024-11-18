import instance from "../../../axios";
import { SelectConditionShoppingResponse } from "../types/select/conditionSP";
export const selectConditionShopping = async (): Promise<SelectConditionShoppingResponse> => {
  try {
    const response = await instance.get<SelectConditionShoppingResponse>("/admin/product/selectConditionSP");
    if (response.data.success) {
      return response.data; 
    } else {
      throw new Error(response.data.msg); 
    }
  } catch (error) {
    console.error("Lỗi condition shopping:", error);
    throw error;
  }
};
