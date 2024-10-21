import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateAuctionThunk } from "../Thunk/updateAuction";
import { reponseProduct, initialProductState } from "../../../../services/product_v2/admin/types/add-product-auction";

const updateAuctionSlice = createSlice({
  name: "product/update",
  initialState: initialProductState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateAuctionThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAuctionThunk.fulfilled, (state, action: PayloadAction<reponseProduct>) => { 
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
      .addCase(updateAuctionThunk.rejected, (state, action) => {
        state.status = "fail";
        const errorPayload = action.payload as reponseProduct; 
        state.error = errorPayload.msg || "Lỗi khi cập nhật sản phẩm";
        console.log(errorPayload.msg);
      });
  },
});

export default updateAuctionSlice.reducer;
