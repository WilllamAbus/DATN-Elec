import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { update } from "../Thunk/update";
import { reponseProduct, initialProductState } from "../../../../services/product_v2/admin/types/add-product";

const updateSlice = createSlice({
  name: "product/update",
  initialState: initialProductState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(update.pending, (state) => {
        state.status = "loading";
      })
      .addCase(update.fulfilled, (state, action: PayloadAction<reponseProduct>) => { 
        state.status = "success";
        const updatedProduct = action.payload.product; 
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
        const errorPayload = action.payload as reponseProduct; 
        state.error = errorPayload.msg || "Lỗi khi cập nhật sản phẩm";
        console.log(errorPayload.msg);
      });
  },
});

export default updateSlice.reducer;
