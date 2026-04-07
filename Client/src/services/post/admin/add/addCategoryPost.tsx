import instance from "../../../axios";
import { Category, CategoryResponse } from "../types/CategoryPost";
import { AxiosError } from "axios";

export const addCategoryPost = async (category: Category): Promise<CategoryResponse> => {
  try {
    if (!category.name || category.name.trim().length < 3) {
      console.error("Tên danh mục phải có ít nhất 3 ký tự.");
      return {
        success: false,
        err: 3,
        msg: "Tên danh mục phải có ít nhất 3 ký tự.",
        status: 400,
      };
    }


    const formData = new FormData();
    formData.append("name", category.name);

    if (category.image && category.image.length > 0) {
      for (let i = 0; i < category.image.length; i++) {
        formData.append("image", category.image[i]);
      }
    } else {
      console.warn("ko có ảnh");
    }


    const response = await instance.post("/admin/post/add-categories-post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Lỗi từ API:", error.response?.data);
      return {
        success: false,
        err: error.response?.data.err || 1,
        msg: error.response?.data.msg || "Đã xảy ra lỗi",
        status: error.response?.status || 500,
        error: error.message,
      };
    } else {
      console.error("Lỗi không xác định khi thêm danh mục:", error);
      return {
        success: false,
        err: 1,
        msg: "Có lỗi xảy ra khi thêm danh mục",
        status: 500,
        error: "Đã xảy ra lỗi không mong muốn",
      };
    }
  }
};
