import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteImageVariantThunk } from "../Thunk";
import { DeleteImageVariantResponse } from "../../../../services/product_v2/admin/types/deleteImageVariant";

interface DeleteImageState {
  status: "idle" | "loading" | "success" | "fail"; 
  error: string | null; 
  isLoading: boolean; 
  message: string | null; 
}

const initialState: DeleteImageState = {
  status: "idle",
  error: null,
  isLoading: false,
  message: null,
};

const deleteImageVariantSlice = createSlice({
  name: "productClient/deleteImageVariant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteImageVariantThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        deleteImageVariantThunk.fulfilled,
        (state, action: PayloadAction<DeleteImageVariantResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.error = null;
          state.message = action.payload.msg;
        }
      )
      .addCase(deleteImageVariantThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi xoá hình ảnh";
        state.message = null;
      });
  },
});

export default deleteImageVariantSlice.reducer;
