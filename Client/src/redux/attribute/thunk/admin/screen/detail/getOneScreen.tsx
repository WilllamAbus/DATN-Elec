import { createAsyncThunk } from "@reduxjs/toolkit";
import { Screen, GetOneScreenResponse } from "../../../../../../services/attribute/types/screen/getOneScreen";
import { getOneScreen } from "../../../../../../services/attribute/screeen/admin/detail/getOneScreen";

export const getOneScreenThunk = createAsyncThunk<Screen, string, { rejectValue: string }>(
   "screen/getone",
   async (screenId: string, { rejectWithValue }) => {
      try {
         const response: GetOneScreenResponse = await getOneScreen(screenId);
         if (response.success) {
            return response.screen as Screen;
         } else {
            return rejectWithValue(response.msg);
         }
      } catch (error) {
         return rejectWithValue("Lỗi hệ thống");
      }
   }
);
