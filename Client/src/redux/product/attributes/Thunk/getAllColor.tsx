import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllColor } from "../../../../services/product_v2/attributes/getAllColor"; 
import { GetAllColorResponse } from "../../../../services/product_v2/types/attributes/getAllColor";

export const getAllColorThunk = createAsyncThunk<GetAllColorResponse>(
  "colorClient/getAllColor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllColor();
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi không xác định");
    }
  }
);
