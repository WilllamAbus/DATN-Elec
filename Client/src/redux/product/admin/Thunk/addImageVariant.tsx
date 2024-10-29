import { createAsyncThunk } from "@reduxjs/toolkit";
import { addImageVariant } from "../../../../services/product_v2/admin/addImageVariant";
import { ImageVariant, ImageVariantResponse } from "../../../../services/product_v2/admin/types/imageVariant";

export const addImageVariantThunk  = createAsyncThunk<
  ImageVariantResponse,
  { product_variant_id: string; imageVariant: ImageVariant },
  { rejectValue: ImageVariantResponse }
>(
  "imageVariant/add",
  async ({ product_variant_id, imageVariant }, { rejectWithValue }) => {
    try {
      const response = await addImageVariant(product_variant_id, imageVariant);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue({
          success: false,
          err: response.err,
          msg: response.msg,
          status: response.status,
        });
      }
    } catch (error) {
      return rejectWithValue({
        success: false,
        err: 1,
        msg: "Lỗi thêm biến thể hình ảnh không thành công",
        status: 500,
      });
    }
  }
);
