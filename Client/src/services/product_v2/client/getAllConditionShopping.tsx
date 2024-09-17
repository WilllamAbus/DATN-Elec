import instance from "../../axios";
import { GetAllConditionShoppingResponse } from "./types/getAllConditionShopping";
export const getAllConditionShopping = async (): Promise<GetAllConditionShoppingResponse> => {
  try {
    const response = await instance.get<GetAllConditionShoppingResponse>("/client/sidebar/auction/get-all-condition-shopping");
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      err: 1,
      msg: "Lỗi",
      status: 500,
      conditionShopping: [],
      error: error.message,
    };
  }
};
