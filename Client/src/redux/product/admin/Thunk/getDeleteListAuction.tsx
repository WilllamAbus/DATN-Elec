import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDeleteListAuction } from "../../../../services/productAuction/admin/getDeleteListAuction";
import { LimitDeleteListAuctionResponse } from "../../../../services/productAuction/types/getDeleteListAuction";

export const getDeleteListAuctionThunk = createAsyncThunk<
  LimitDeleteListAuctionResponse,
  { page: number; search?: string },
  { rejectValue: string }
>("products/getDeleteListAuction", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await getDeleteListAuction(page, search);
    if (response.success) {
      return response;
    } else {
      return rejectWithValue(response.msg);
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Lỗi không xác định");
  }
});
