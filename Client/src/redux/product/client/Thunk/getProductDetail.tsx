import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProductDetail } from "../../../../services/detailProduct/getDetailProduct";
import { GetDetailProductResponse } from "../../../../services/detailProduct/types/getDetailProduct";  

export const getProductDetailThunk = createAsyncThunk<
  GetDetailProductResponse, 
  { slug: string; storage?: string }, 
  { rejectValue: string }
>(
  "productClient/getProductDetail",
  async ({ slug, storage }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await getProductDetail(slug, storage || null); 

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
