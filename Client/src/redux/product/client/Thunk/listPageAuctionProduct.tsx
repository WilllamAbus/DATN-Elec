import { createAsyncThunk } from "@reduxjs/toolkit";
import { listPageAuction } from "../../../../services/product_v2/client";
import { LimitPageAuctionProductResponse } from "../types/listPageAuctionProduct";

// Cập nhật thunk để nhận _sort
export const listPageAuctionProductThunk = createAsyncThunk<
  LimitPageAuctionProductResponse,
  { page: number; _sort: string },
  { rejectValue: string }
>("productsClient/listPageAuction", async ({ page, _sort }, { rejectWithValue }) => {
  try {
    const response = await listPageAuction(page, _sort);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
