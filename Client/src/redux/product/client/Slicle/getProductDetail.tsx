import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getProductDetailThunk } from "../Thunk";
import { GetDetailProductResponse } from "../../../../services/detailProduct/types/getDetailProduct";

interface ProductDetailState {
  productDetail: GetDetailProductResponse['data'] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: ProductDetailState = {
  productDetail: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getProductDetailSlice = createSlice({
  name: "productClient/getProductDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductDetailThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProductDetailThunk.fulfilled,
        (state, action: PayloadAction<GetDetailProductResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.productDetail = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getProductDetailThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching product details";
      });
  },
});

export default getProductDetailSlice.reducer;
