import { createAsyncThunk } from "@reduxjs/toolkit";
import { getListScreen } from "../../../../../../services/attribute/screeen/admin/list/getListScreen";
import { ResponseScreen } from "../../../../../../services/attribute/types/screen/listScreen";

// Tạo Thunk cho việc lấy danh sách màn hình
export const getListScreenThunk = createAsyncThunk<
   ResponseScreen,
   { page: number; search?: string },
   { rejectValue: string }
>(
   "screen/fetchListScreen",
   async ({ page, search }, { rejectWithValue }) => {
      try {
         const response = await getListScreen(page, search);
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
