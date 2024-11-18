import { createAsyncThunk } from "@reduxjs/toolkit";
import { getOneImageVariant } from "../../../../services/product_v2/admin/getOneImageVariant"; 
import { GetOneImageVariantResponse } from "../../../../services/product_v2/admin/types/getOneImageVariant"; 

export const getOneImageVariantThunk = createAsyncThunk<
  GetOneImageVariantResponse,
  { imageId: string }, 
  { rejectValue: string }
>(
  "productClient/getOneImageVariant",
  async ({ imageId }, { rejectWithValue }) => {
    try {
      if (!imageId) {
        return rejectWithValue("ID biến thể hình ảnh là bắt buộc");
      }

      const response = await getOneImageVariant(imageId);

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
