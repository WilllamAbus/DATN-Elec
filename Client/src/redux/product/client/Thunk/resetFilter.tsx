import { createAsyncThunk } from "@reduxjs/toolkit";
import { resetFilter } from "../../../../services/product_v2/client"; // Đảm bảo đường dẫn chính xác
import { LimitPageAuctionProductResponse } from "../types/listPageAuctionProduct";

export const resetFilterThunk = createAsyncThunk<
  LimitPageAuctionProductResponse,
  void,
  { rejectValue: string }
>(
  "productsClient/resetFilter",
  async (_, { rejectWithValue }) => {
    try {
      const response = await resetFilter();
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
