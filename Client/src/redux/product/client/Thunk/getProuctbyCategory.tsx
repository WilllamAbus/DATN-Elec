// Thunk
import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetProductsByCategoryResponse } from "../types/getProuctbyCategory";
import { getProductsByCategory } from "../../../../services/clientcate/client/navbar";

export const getProductsByCategoryThunk = createAsyncThunk<
  GetProductsByCategoryResponse,
  { categoryId: string; page: number },
  { rejectValue: string }
>(
  "productsClient/getProductsByCategory",
  async ({ categoryId, page }, { rejectWithValue }) => {
    try {
      const response = await getProductsByCategory(categoryId, page);
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
