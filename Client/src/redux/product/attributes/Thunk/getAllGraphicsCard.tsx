import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllGraphicsCard } from "../../../../services/product_v2/attributes/getAllGraphicsCard"; 
import { GetAllGraphicsCardResponse } from "../../../../services/product_v2/types/attributes/getAllGraphicsCard";

export const getAllGraphicsCardThunk = createAsyncThunk<GetAllGraphicsCardResponse>(
  "graphicsCardClient/getAllGraphicsCard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllGraphicsCard();
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi không xác định");
    }
  }
);
