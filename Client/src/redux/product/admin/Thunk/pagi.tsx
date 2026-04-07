import { createAsyncThunk } from "@reduxjs/toolkit";
import { pagiCrudProduct } from "../../../../services/product_v2/admin";
import { LimitCrudProductResponse } from "../../../../services/product_v2/admin/types/pagination";

export const fetchPaginatedProducts = createAsyncThunk<
  LimitCrudProductResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("products/fetchPaginated", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await pagiCrudProduct(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
