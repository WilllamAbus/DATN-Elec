import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProductVariantsByVariantPrice } from "../../../../services/detailProduct/getAllProductVariantsByVariantPrice";
import { GetAllProductVariantsByVariantPriceResponse } from "../../../../services/detailProduct/types/getAllProductVariantsByVariantPrice";

// Tạo Thunk cho API `getAllProductVariantsByVariantPrice`
export const getAllProductVariantsByVariantPriceThunk = createAsyncThunk<
  GetAllProductVariantsByVariantPriceResponse,
  { slug: string },
  { rejectValue: string }
>(
  "productClient/getAllProductVariantsByVariantPrice",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await getAllProductVariantsByVariantPrice(slug);

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
