import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getOneImageVariantThunk } from "../Thunk";
import { GetOneImageVariantResponse } from "../../../../services/product_v2/admin/types/getOneImageVariant";

interface ImageVariantState {
  imageVariant: GetOneImageVariantResponse["imageVariant"] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: ImageVariantState = {
  imageVariant: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getOneImageVariantSlice = createSlice({
  name: "productClient/getOneImageVariant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOneImageVariantThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOneImageVariantThunk.fulfilled,
        (state, action: PayloadAction<GetOneImageVariantResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.imageVariant = action.payload.imageVariant;
          state.error = null;
        }
      )
      .addCase(getOneImageVariantThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi lấy thông tin biến thể hình ảnh";
      });
  },
});

export default getOneImageVariantSlice.reducer;
