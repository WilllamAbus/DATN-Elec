import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPhoneByVariants } from "../../../../services/home/product/getPhoneByVariants";
import { GetPhoneVariantsResponse } from "../../../../services/home/types/getPhoneByVariants";

export const getPhoneByVariantsThunk = createAsyncThunk<
  GetPhoneVariantsResponse,
  { page: number },  // Update here to include 'page' parameter
  { rejectValue: string }
>(
  "productClient/getPhoneByVariants",
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await getPhoneByVariants(page);  // Pass 'page' to the service function

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
