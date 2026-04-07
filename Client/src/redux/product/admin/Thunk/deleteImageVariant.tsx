import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteImageVariant } from "../../../../services/product_v2/admin/deleteImageVariant";
import { DeleteImageVariantResponse } from "../../../../services/product_v2/admin/types/deleteImageVariant";

/**
 * Thunk action xoá ảnh theo imageId và variantId
 */
export const deleteImageVariantThunk = createAsyncThunk<
  DeleteImageVariantResponse,
  { imageId: string; variantId: string },
  { rejectValue: string }
>(
  "productClient/deleteImageVariant",
  async ({ imageId, variantId }, { rejectWithValue }) => {
    try {
      if (!imageId || !variantId) {
        return rejectWithValue("ID ảnh và ID biến thể sản phẩm là bắt buộc");
      }

      const response = await deleteImageVariant(imageId,variantId);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.msg);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định khi xoá ảnh");
    }
  }
);
