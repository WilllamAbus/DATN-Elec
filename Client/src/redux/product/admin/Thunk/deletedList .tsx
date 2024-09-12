import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDeletedList } from "../../../../services/product_v2/admin";
import { LimitDeletedListResponse } from "../types/pagi";

export const DeleteListProductThunk = createAsyncThunk<
  LimitDeletedListResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("products/fetchDeletedProducts", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await getDeletedList(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
