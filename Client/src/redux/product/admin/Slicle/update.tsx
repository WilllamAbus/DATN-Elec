import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { update } from "../Thunk/update";
import { ProductStateUpdate, ApiResponse, ProductUpdate } from "../types";

const initialState: ProductStateUpdate = {
  products: [],
  status: "idle",
  error: null,
};

const updateSlice = createSlice({
  name: "product/update",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(update.pending, (state) => {
        state.status = "loading";
      })
      .addCase(update.fulfilled, (state, action: PayloadAction<ApiResponse<ProductUpdate>>) => {
        state.status = "success";
        const updatedProduct = action.payload.data;
        if (updatedProduct) {
          state.products = state.products.map(product =>
            product._id === updatedProduct._id ? updatedProduct : product
          );
        }
        state.error = null;
        console.log(action.payload.msg);
      })
      .addCase(update.rejected, (state, action) => {
        state.status = "fail";
        const errorPayload = action.payload as ApiResponse<null>;
        state.error = errorPayload.msg || "Lỗi khi cập nhật sản phẩm";
        console.log(errorPayload.msg);
      });
  },
});

export default updateSlice.reducer;
