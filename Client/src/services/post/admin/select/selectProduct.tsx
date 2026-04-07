import instance from "../../../axios";
import {  SelectProductResponse } from "../types/selectProduct";

export const selectProducts = async (): Promise<SelectProductResponse> => {
  try {
    const response = await instance.get<SelectProductResponse>("/admin/post/select-product");
    if (response.data.success) {
      return response.data; 
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    throw error;
  }
};
