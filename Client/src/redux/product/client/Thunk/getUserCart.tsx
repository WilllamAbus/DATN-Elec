import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserCart } from "../../../../services/detailProductAuction/getUserCart";
import { GetUserCartResponse } from "../../../../services/detailProductAuction/types/getUserCart";

export const getUserCartThunk = createAsyncThunk<
  GetUserCartResponse,
  void,
  { rejectValue: string }
>(
  "userCart/getUserCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserCart();

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message || "Lỗi không xác định");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);
