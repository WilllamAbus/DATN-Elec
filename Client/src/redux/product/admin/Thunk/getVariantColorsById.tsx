import { createAsyncThunk } from "@reduxjs/toolkit";
import { getVariantColorsById } from "../../../../services/product_v2/admin/select/getVariantColorsById";
import { GetVariantColorsByIdResponse } from "../../../../services/product_v2/admin/types/getVariantColorsById";

export const getVariantColorsByIdThunk = createAsyncThunk<
  GetVariantColorsByIdResponse,
  { id: string },
  { rejectValue: string }
>(
  "productClient/getVariantColorsById",
  async ({ id }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("ID là bắt buộc");
      }

      const response = await getVariantColorsById(id);
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
