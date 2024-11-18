import { createAsyncThunk } from "@reduxjs/toolkit";
import { getImageByVariantId } from "../../../../services/product_v2/admin/getImageByVariantId";
import { ImageResponse } from "../../../../services/product_v2/admin/types/getImageByVariantId";

export const getImageByVariantIdThunk = createAsyncThunk<
  ImageResponse,
  { variantId: string; page?: number },
  { rejectValue: string } 
>(
  "productClient/getImageByVariantId",
  async ({ variantId, page = 1 }, { rejectWithValue }) => {
    try {
      if (!variantId) {
        return rejectWithValue("ID biến thể sản phẩm là bắt buộc");
      }

      const response = await getImageByVariantId(variantId, page);

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
