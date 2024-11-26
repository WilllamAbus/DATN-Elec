import { createAsyncThunk } from "@reduxjs/toolkit";
import { softDeleteRam } from "../../../../../../services/attribute/ram/admin/softDelete/softDeleteRam";
import { SoftDeleteRamResponse } from "../../../../../../services/attribute/types/ram/softDeleteRam";

export const softDeleteRamThunk = createAsyncThunk<
  SoftDeleteRamResponse,
  { ramId: string },
  { rejectValue: string }
>(
  "ram/softDeleteRam",
  async ({ ramId }, { rejectWithValue }) => {
    try {
      const response = await softDeleteRam(ramId);
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
