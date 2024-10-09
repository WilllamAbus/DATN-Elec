import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProductDetail } from "../../../../services/detailProduct/getDetailProduct";
import { GetDetailProductResponse } from "../../../../services/detailProduct/types/getDetailProduct";

export const getProductDetailThunk = createAsyncThunk<
  GetDetailProductResponse,
  string, 
  { rejectValue: string }
>(
  "productClient/getProductDetail",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await getProductDetail(slug);
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
