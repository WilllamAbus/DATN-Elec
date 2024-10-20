import { createAsyncThunk } from "@reduxjs/toolkit";
import { listProductAuction } from "../../../../services/productAuction/admin/list";
import { LimitProductAuctionResponse } from "../../../../services/productAuction/types/listProductAuction";
export const listProductAuctionThunk = createAsyncThunk<
LimitProductAuctionResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("products/listProductAuction", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await listProductAuction(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
