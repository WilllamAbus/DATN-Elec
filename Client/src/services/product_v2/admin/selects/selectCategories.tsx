import instance from "../../../axios";
import { SelectCategoryResponse } from "../types/select/category";
export const selectCategories = async (): Promise<SelectCategoryResponse> => {
  try {
    const response = await instance.get<SelectCategoryResponse>("/admin/product/selectcategories");
    if (response.data.success) {
      return response.data; 
    } else {
      throw new Error(response.data.msg); 
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh mục sản phẩm:", error);
    throw error;
  }
};
