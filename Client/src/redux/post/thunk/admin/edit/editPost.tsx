import { createAsyncThunk } from "@reduxjs/toolkit";
import { editPost } from "../../../../../services/post/admin/edit/editPost"; 
import { responsePost, Post } from "../../../../../services/post/admin/types/post";

// Thunk để cập nhật bài viết
export const editPostThunk = createAsyncThunk<
  responsePost, // Kiểu dữ liệu trả về
  { postId: string; postData: Post }, // Tham số đầu vào
  { rejectValue: responsePost } // Kiểu dữ liệu khi reject
>(
  "post/edit",
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await editPost(postId, postData);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue({
          success: false,
          err: response.err,
          msg: response.msg,
          status: response.status,
        });
      }
    } catch (error) {
      return rejectWithValue({
        success: false,
        err: 1,
        msg: "Có lỗi xảy ra khi chỉnh sửa bài viết",
        status: 500,
      });
    }
  }
);
