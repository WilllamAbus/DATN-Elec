import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addVariantThunk } from "../Thunk";
import {
  ProductStateAddVariant,
  ProductVariantResponse,
  ProductVariant,
} from "../types/addVariant";

const initialState: ProductStateAddVariant = {
  variants: [],
  status: "idle",
  error: null,
};

const addVariantSlice = createSlice({
  name: "product/addVariant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addVariantThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        addVariantThunk.fulfilled,
        (state, action: PayloadAction<ProductVariantResponse<ProductVariant>>) => {
          state.status = "success";
          if (action.payload.data) {
            state.variants.push(action.payload.data);
          }
          state.error = null;
          console.log(action.payload.msg);
        }
      )
      .addCase(addVariantThunk.rejected, (state, action) => {
        state.status = "fail";
        const errorPayload = action.payload as ProductVariantResponse<null>;
        state.error = errorPayload.msg || "Lỗi thêm biến thể không thành công";
        console.log(errorPayload.msg);
      });
  },
});

export default addVariantSlice.reducer;
