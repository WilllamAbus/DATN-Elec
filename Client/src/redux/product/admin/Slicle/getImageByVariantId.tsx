import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getImageByVariantIdThunk } from "../Thunk";
import { ImageResponse, Pagination } from "../../../../services/product_v2/admin/types/getImageByVariantId";

interface ImageState {
  imageList: ImageResponse["data"] | null; 
  status: "idle" | "loading" | "success" | "fail"; 
  error: string | null; 
  isLoading: boolean; 
  pagination: Pagination | null; 
}


const initialState: ImageState = {
  imageList: null,
  status: "idle",
  error: null,
  isLoading: false,
  pagination: null,
};

const getImageByVariantIdSlice = createSlice({
  name: "productClient/getImageByVariantId",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getImageByVariantIdThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getImageByVariantIdThunk.fulfilled,
        (state, action: PayloadAction<ImageResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.imageList = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      )
      .addCase(getImageByVariantIdThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi lấy danh sách hình ảnh";
      });
  },
});


export default getImageByVariantIdSlice.reducer;
