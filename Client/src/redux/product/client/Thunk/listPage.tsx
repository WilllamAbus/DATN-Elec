import { createAsyncThunk } from "@reduxjs/toolkit";
import { listPage } from "../../../../services/product_v2/client";
import { LimitPageProductResponse } from "../types/listPage";

export const listPageThunk = createAsyncThunk<
  LimitPageProductResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("productsClient/listPage", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await listPage(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
