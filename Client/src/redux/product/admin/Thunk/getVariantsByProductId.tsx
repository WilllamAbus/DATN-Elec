import { createAsyncThunk } from "@reduxjs/toolkit";
import { getVariantsByProductId } from "../../../../services/product_v2/admin/getVariantByProductId"; 
import { VariantsResponse } from "../../../../services/product_v2/admin/types/getVariantByProductId";

export const getVariantsByProductIdThunk = createAsyncThunk<
  VariantsResponse,
  { productId: string; page?: number },
  { rejectValue: string }
>(
  "productClient/getVariantsByProductId",
  async ({ productId, page = 1 }, { rejectWithValue }) => {
    try {
      if (!productId) {
        return rejectWithValue("ID sản phẩm là bắt buộc");
      }

      const response = await getVariantsByProductId(productId, page);
      console.log(response);

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
