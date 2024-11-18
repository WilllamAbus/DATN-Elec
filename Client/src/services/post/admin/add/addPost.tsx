import instance from "../../../axios";
import { Post, responsePost } from "../types/post"; 

import { AxiosError } from "axios";

export const addPost = async (post: Post): Promise<responsePost> => {
  try {
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("content", post.content);
    formData.append("product", post.product);
    formData.append("category", post.category);

    if (post.thumbnail && post.thumbnail.length > 0) {
      for (let i = 0; i < post.thumbnail.length; i++) {
        formData.append("thumbnail", post.thumbnail[i]);
      }
    } else {
      console.warn("Không có ảnh thu nhỏ");
    }

    // Log the contents of FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await instance.post("/admin/post/add-post-product", formData, {
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
      console.error("Lỗi không xác định khi thêm bài viết:", error);
      return {
        success: false,
        err: 1,
        msg: "Có lỗi xảy ra khi thêm bài viết",
        status: 500,
        error: "Đã xảy ra lỗi không mong muốn",
      };
    }
  }
};
