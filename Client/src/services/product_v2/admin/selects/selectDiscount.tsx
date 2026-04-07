import instance from "../../../axios";
import { SelectDiscountResponse } from "../types/select/discount";

export const selectDiscount = async (): Promise<SelectDiscountResponse> => {
  try {
    const response = await instance.get<SelectDiscountResponse>("/admin/product/selectDiscount");
    if (response.data.success) {
      return response.data; 
    } else {
      throw new Error(response.data.msg); 
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách discount:", error);
    throw error;
  }
};
