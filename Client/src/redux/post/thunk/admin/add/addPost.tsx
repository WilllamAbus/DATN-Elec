import { createAsyncThunk } from "@reduxjs/toolkit";
import { addPost } from "../../../../../services/post/admin/add/addPost"; 
import { responsePost, Post } from "../../../../../services/post/admin/types/post";

export const addPostThunk = createAsyncThunk<
  responsePost, 
  Post,  
  { rejectValue: responsePost }  
>(
  "post/add",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await addPost(postData);
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
        msg: "Có lỗi xảy ra khi thêm bài viết",
        status: 500,
      });
    }
  }
);
