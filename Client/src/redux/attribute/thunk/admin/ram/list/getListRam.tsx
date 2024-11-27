import { createAsyncThunk } from "@reduxjs/toolkit";
import { getListRam } from "../../../../../../services/attribute/ram/admin/list/getListRam";
import { ResponseRam } from "../../../../../../services/attribute/types/ram/listRam";

export const getListRamThunk = createAsyncThunk<
   ResponseRam,
   { page: number; search?: string },
   { rejectValue: string }
>(
   "ram/fetchListRam",
   async ({ page, search }, { rejectWithValue }) => {
      try {
         const response = await getListRam(page, search);
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
