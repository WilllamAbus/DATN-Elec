import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editVariantThunk } from "../Thunk";
import { ApiResponse, ProductVariant } from "../../../../services/product_v2/admin/types/editVariant";

interface EditVariantState {
  status: "idle" | "loading" | "success" | "fail";
  variant: ProductVariant | null;
  error: string | null;
}

const initialEditVariantState: EditVariantState = {
  status: "idle",
  variant: null,
  error: null,
};

const editVariantSlice = createSlice({
  name: "variant/edit",
  initialState: initialEditVariantState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editVariantThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editVariantThunk.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.status = "success";
        state.variant = action.payload.variant || null; 
        state.error = null;
        console.log(action.payload.msg);
      })
      .addCase(editVariantThunk.rejected, (state, action) => {
        state.status = "fail";
        const errorPayload = action.payload as ApiResponse;
        state.error = errorPayload.msg || "Lỗi khi cập nhật variant";
        console.log(errorPayload.msg);
      });
  },
});

export default editVariantSlice.reducer;
