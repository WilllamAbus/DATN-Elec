import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLaptopByVariants } from "../../../../services/home/product/getLaptopByVariants";
import { GetLaptopVariantsResponse } from "../../../../services/home/types/getLaptopByVariants";

export const getLaptopByVariantsThunk = createAsyncThunk<
GetLaptopVariantsResponse,
  { page: number },  
  { rejectValue: string }
>(
  "productClient/getLaptopByVariants",
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await getLaptopByVariants(page);  

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
