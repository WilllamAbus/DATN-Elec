import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCpu } from "../../../../services/product_v2/attributes/getAllCpu"; 
import { GetAllCpuResponse } from "../../../../services/product_v2/types/attributes/getAllCpu";
export const getAllCpuThunk = createAsyncThunk<GetAllCpuResponse>(
  "cpuClient/getAllCpu",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCpu();
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi không xác định");
    }
  }
);
