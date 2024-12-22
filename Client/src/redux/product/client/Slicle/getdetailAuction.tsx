import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProductDetailAuctionThunk } from "../Thunk";
import { ProductAuctionResponse } from "../../../../services/detailProductAuction/types/detailAuction";

interface ProductDetailState {
  productDetailAuction: ProductAuctionResponse['data'] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: ProductDetailState = {
  productDetailAuction: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getProductDetailAuctionSlice = createSlice({
  name: "productClient/getProductDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductDetailAuctionThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProductDetailAuctionThunk.fulfilled,
        (state, action: PayloadAction<ProductAuctionResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.productDetailAuction = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getProductDetailAuctionThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching product details";
      });
  },
});

export default getProductDetailAuctionSlice.reducer;
