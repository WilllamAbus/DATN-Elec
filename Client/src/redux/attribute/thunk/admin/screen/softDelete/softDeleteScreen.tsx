import { createAsyncThunk } from "@reduxjs/toolkit";
import { softDeleteScreen } from "../../../../../../services/attribute/screeen/admin/softDelete/softDeleteScreen";
import { SoftDeleteScreenResponse } from "../../../../../../services/attribute/types/screen/softDeleteScreen";
export const softDeleteScreenThunk = createAsyncThunk<
  SoftDeleteScreenResponse,
  { screenId: string },
  { rejectValue: string }
>(
  "screen/softDeleteScreen",
  async ({ screenId }, { rejectWithValue }) => {
    try {
      const response = await softDeleteScreen(screenId);
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
