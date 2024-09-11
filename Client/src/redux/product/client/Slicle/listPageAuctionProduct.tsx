import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { listPageAuctionProductThunk } from "../Thunk";
import {
  LimitPageAuctionProductResponse,
  Pagination,
  products,
} from "../types/listPageAuctionProduct";

interface AuctionProductState {
  products: products[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
  isLoading: boolean;
}

const initialState: AuctionProductState = {
  products: [],
  status: "idle",
  error: null,
  pagination: null,
  isLoading: false,
};

const listPageAuctionProductSlice = createSlice({
  name: "productsClient/listPageAuction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listPageAuctionProductThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        listPageAuctionProductThunk.fulfilled,
        (state, action: PayloadAction<LimitPageAuctionProductResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.products = action.payload.data.products;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(listPageAuctionProductThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = (action.payload as string) || "Lỗi không xác định";
      });
  },
});

export default listPageAuctionProductSlice.reducer;
