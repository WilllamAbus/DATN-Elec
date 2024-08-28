import instance from "../../../axios";
import { Discount, SelectDiscountResponse } from "../types/discount";

export const selectDiscount = async (): Promise<Discount[]> => {
  try {
    const response = await instance.get<SelectDiscountResponse>("/admin/product/selectDiscount");
    return response.data.discounts;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách discount:", error);
    throw error;
  }
};
