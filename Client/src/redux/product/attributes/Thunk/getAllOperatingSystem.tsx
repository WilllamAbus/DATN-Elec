import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOperatingSystem } from "../../../../services/product_v2/attributes/getAllOperatingSystem"; 
import { GetAllOperatingSystemResponse } from "../../../../services/product_v2/types/attributes/getAllOperatingSystem";
export const getAllOperatingSystemThunk = createAsyncThunk<GetAllOperatingSystemResponse>(
  "operatingSystemClient/getAllOperatingSystem",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllOperatingSystem();
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi không xác định");
    }
  }
);
