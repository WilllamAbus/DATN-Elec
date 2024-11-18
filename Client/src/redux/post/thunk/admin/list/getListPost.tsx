import { createAsyncThunk } from "@reduxjs/toolkit";
import { getListPost } from "../../../../../services/post/admin/list/getlistPost";
import { ResponsePost } from "../../../../../services/post/admin/types/listPost";

// Tạo Thunk cho việc lấy danh sách bài viết
export const getListPostThunk = createAsyncThunk<
   ResponsePost,
   { page: number; search?: string },
   { rejectValue: string }
>(
   "post/fetchListPost",
   async ({ page, search }, { rejectWithValue }) => {
      try {

         const response = await getListPost(page, search);
         if (response.success) {
            return response;
         } else {
            return rejectWithValue(response.msg);
         }
      } catch (error: any) {
         return rejectWithValue(error.message || "Lỗi không xác định");
      }
   }
);
