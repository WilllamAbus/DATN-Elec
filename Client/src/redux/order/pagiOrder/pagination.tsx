import { createAsyncThunk } from "@reduxjs/toolkit";
import { pagiCrudOrder } from "../../../services/order/pagination/pagiOrder";
import { LimitCrudOrderResponse } from "../../../types/order/order";

export const fetchPaginatedOrder = createAsyncThunk<
  LimitCrudOrderResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("products/fetchPaginated", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await pagiCrudOrder(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
