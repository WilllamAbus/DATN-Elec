import { createAsyncThunk } from "@reduxjs/toolkit";
import { pagiCrudProduct } from "../../../../services/product_v2/admin";
import { LimitCrudProductResponse } from "../types/pagi";

export const fetchPaginatedProducts = createAsyncThunk<
  LimitCrudProductResponse,
  { page: number },
  { rejectValue: string }
>("products/fetchPaginated", async ({ page }, { rejectWithValue }) => {
  try {
    const response = await pagiCrudProduct(page);
    if (response.success) { 
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
