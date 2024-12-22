import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProductDetailAuction } from "../../../../services/detailProductAuction/detailAuction";
import { ProductAuctionResponse } from "../../../../services/detailProductAuction/types/detailAuction";  

export const getProductDetailAuctionThunk = createAsyncThunk<
ProductAuctionResponse, 
  { slug: string; storage?: string; color?: string }, 
  { rejectValue: string }
>(
  "productClient/getProductDetailAuction",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await getProductDetailAuction(slug);

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
