import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllBattery } from "../../../../services/product_v2/attributes/getAllBattery"; 
import { GetAllBatteryResponse } from "../../../../services/product_v2/types/attributes/getAllBattery";
export const getAllBatteryThunk = createAsyncThunk<GetAllBatteryResponse>(
  "batteryClient/getAllBattery",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllBattery();
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi không xác định");
    }
  }
);
