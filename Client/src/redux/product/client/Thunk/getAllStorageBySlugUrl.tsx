import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStorageBySlugUrl } from "../../../../services/detailProduct/getAllStorageBySlugUrl";
import { GetAllStorageBySlugUrlResponse } from "../../../../services/detailProduct/types/getAllStorageBySlugUrl";  

export const getAllStorageBySlugUrlThunk = createAsyncThunk<
  GetAllStorageBySlugUrlResponse,
  { slug: string },
  { rejectValue: string }
>(
  "productClient/getAllStorageBySlugUrl",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await getAllStorageBySlugUrl(slug);

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
