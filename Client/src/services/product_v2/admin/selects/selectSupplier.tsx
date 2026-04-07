import instance from "../../../axios";
import { SelectSupplierResponse } from "../types/select/supplier";
export const selectSupplier = async (): Promise<SelectSupplierResponse> => {
  try {
    const response = await instance.get<SelectSupplierResponse>("/admin/product/selectsupplier");
    if (response.data.success) {
      return response.data; 
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách supplier:", error);
    throw error;
  }
};
