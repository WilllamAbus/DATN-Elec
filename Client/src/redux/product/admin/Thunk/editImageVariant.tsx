import { createAsyncThunk } from "@reduxjs/toolkit";
import { editImageVariant } from "../../../../services/product_v2/admin/editImageVariant";
import { EditImageVariantResponse, ImageVariant } from "../../../../services/product_v2/admin/types/editImageVariant";

export const editImageVariantThunk = createAsyncThunk<
   EditImageVariantResponse,
   { imageVariantId: string; imageVariant: ImageVariant },
   { rejectValue: string }
>(
   "productClient/editImageVariant",
   async ({ imageVariantId, imageVariant }, { rejectWithValue }) => {
      try {
         if (!imageVariantId || !imageVariant) {
            return rejectWithValue("ID biến thể sản phẩm và dữ liệu là bắt buộc");
         }

         const response = await editImageVariant(imageVariantId, imageVariant);

         if (response.success) {
            return response;
         } else {
            return rejectWithValue(response.msg);
         }
      } catch (error: any) {
         return rejectWithValue(error.message || "Lỗi không xác định khi cập nhật biến thể hình ảnh");
      }
   }
);
