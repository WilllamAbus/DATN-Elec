import instance from "../../../axios";
import { SelectCategoryPostResponse } from "../types/selectCategoryPost";
export const selectCategoryPost = async (): Promise<SelectCategoryPostResponse> => {
  try {
    const response = await instance.get<SelectCategoryPostResponse>("/admin/post/select-categories-post");
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh mục bài viết:", error);
    throw error;
  }
};
