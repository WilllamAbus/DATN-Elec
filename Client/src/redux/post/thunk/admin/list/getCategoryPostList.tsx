
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoryPostList } from "../../../../../services/post/admin/list/getCategoryPostList"; 
import { CategoryPostResponse } from "../../../../../services/post/admin/types/listCategoryPost";

export const getCategoryPostListThunk = createAsyncThunk<
  CategoryPostResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("categoryPost/fetchCategoryPosts", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await getCategoryPostList(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
