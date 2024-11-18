
import { createAsyncThunk } from "@reduxjs/toolkit";
import { editVariant } from "../../../../services/product_v2/admin/editVariant";
import { ApiResponse, ProductVariant } from "../../../../services/product_v2/admin/types/editVariant";

export const editVariantThunk = createAsyncThunk<
ApiResponse,
  { variantId: string; updatedData: Partial<ProductVariant> },
  { rejectValue: ApiResponse }
>(
  "variant/edit",
  async ({ variantId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await editVariant(variantId, updatedData);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue({
          success: false,
          err: response.err,
          msg: response.msg,
          status: response.status,
          variant: {} as ProductVariant,
        });
      }
    } catch (error) {
      return rejectWithValue({
        success: false,
        err: 1,
        msg: "Lỗi khi cập nhật variant",
        status: 500,
        variant: {} as ProductVariant,
      });
    }
  }
);
