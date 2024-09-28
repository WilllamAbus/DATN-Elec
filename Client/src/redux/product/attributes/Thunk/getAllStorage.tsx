import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStorage } from "../../../../services/product_v2/attributes/getAllStorage"; 
import { GetAllStorageResponse } from "../../../../services/product_v2/types/attributes/getAllStorage";

export const getAllStorageThunk = createAsyncThunk<GetAllStorageResponse>(
  "storageClient/getAllStorage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllStorage();
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Lỗi không xác định");
    }
  }
);
