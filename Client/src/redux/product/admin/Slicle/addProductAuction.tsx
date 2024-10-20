import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { add } from "../Thunk/add";
import { reponseProduct, initialProductState } from "../../../../services/product_v2/admin/types/add-product-auction";

const addProductAuctionSlice = createSlice({
  name: "product/add",
  initialState: initialProductState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(add.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(add.fulfilled, (state, action: PayloadAction<reponseProduct>) => {
        state.status = "success";
        state.isLoading = false;
        if (action.payload.product) {
          state.products.push({
            ...action.payload.product,
          });
        }
        state.error = null;
        console.log(action.payload.msg);
      })
      .addCase(add.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        const errorPayload = action.payload as reponseProduct;
        state.error = errorPayload?.msg || "Lỗi thêm hong có được";
        console.log(errorPayload?.msg);
      });
  },
});

export default addProductAuctionSlice.reducer;
