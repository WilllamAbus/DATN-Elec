import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editImageVariantThunk } from "../Thunk";
import { EditImageVariantResponse } from "../../../../services/product_v2/admin/types/editImageVariant";

interface EditImageVariantState {
   status: "idle" | "loading" | "success" | "fail";
   error: string | null;
   isLoading: boolean;
   message: string | null;
}

const initialState: EditImageVariantState = {
   status: "idle",
   error: null,
   isLoading: false,
   message: null,
};

const editImageVariantSlice = createSlice({
   name: "productClient/editImageVariant",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(editImageVariantThunk.pending, (state) => {
            state.status = "loading";
            state.isLoading = true;
            state.error = null;
            state.message = null;
         })
         .addCase(
            editImageVariantThunk.fulfilled,
            (state, action: PayloadAction<EditImageVariantResponse>) => {
               state.status = "success";
               state.isLoading = false;
               state.error = null;
               state.message = action.payload.msg;
            }
         )
         .addCase(editImageVariantThunk.rejected, (state, action) => {
            state.status = "fail";
            state.isLoading = false;
            state.error = action.payload || "Lỗi khi cập nhật biến thể hình ảnh";
            state.message = null;
         });
   },
});

export default editImageVariantSlice.reducer;
