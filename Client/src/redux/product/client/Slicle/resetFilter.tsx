import { createSlice } from "@reduxjs/toolkit";
import { resetFilterThunk } from "../Thunk";
import {
  Pagination,
  products,
  ProductBrand
} from "../types/listPageAuctionProduct";

interface AuctionProductState {
  products: products[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
  isLoading: boolean;
  brand: ProductBrand[];
  minPrice: number | null; 
  maxPrice: number | null; 
}

const initialState: AuctionProductState = {
  products: [],
  status: "idle",
  error: null,
  pagination: null,
  isLoading: false,
  brand: [],
  minPrice: null, 
  maxPrice: null, 
};

const resetFilterAuctionProductSlice = createSlice({
  name: "productsClient/resetFilter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetFilterThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        resetFilterThunk.fulfilled,
        (state, action) => {
          state.status = "success";
          state.isLoading = false;
          state.products = action.payload.data.products;
          state.pagination = action.payload.pagination;
          state.brand = action.payload.data.brand || [];
          state.minPrice = null;
          state.maxPrice = null; 
        }
      )
      .addCase(resetFilterThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.error.message || "Unknown error";
      });
  },
});

export default resetFilterAuctionProductSlice.reducer;
