import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAccessoryByVariants } from "../../../../services/home/product/getAccessoryByVariants";
import { GetAccessoryVariantsResponse } from "../../../../services/home/types/getAccessoryByVariants";

export const getAccessoryByVariantsThunk = createAsyncThunk<
GetAccessoryVariantsResponse,
  { page: number }, 
  { rejectValue: string }
>(
  "productClient/getAccessoryByVariants",
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await getAccessoryByVariants(page); 

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
