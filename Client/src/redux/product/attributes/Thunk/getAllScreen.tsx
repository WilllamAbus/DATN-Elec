import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllScreen } from "../../../../services/product_v2/attributes/getAllScreen"; 
import { GetAllScreenResponse } from "../../../../services/product_v2/types/attributes/getAllScreen";

export const getAllScreenThunk = createAsyncThunk<GetAllScreenResponse>(
  "screenClient/getAllScreen",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllScreen();
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi không xác định");
    }
  }
);
