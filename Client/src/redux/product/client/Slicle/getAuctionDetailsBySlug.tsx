import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuctionDetailsBySlugThunk } from "../Thunk";
import { AuctionDetailsResponse, Bidder } from "../../../../services/detailProductAuction/types/getAuctionDetailsBySlug";

interface AuctionDetailState {
  bidders: Bidder[] | null;
  auctionDetails: AuctionDetailsResponse['bidders'] | null;
  product: AuctionDetailsResponse['product'] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: AuctionDetailState = {
  bidders: null,
  auctionDetails: null,
  product: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getAuctionDetailsBySlugSlice = createSlice({
  name: "auctionClient/getAuctionDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAuctionDetailsBySlugThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAuctionDetailsBySlugThunk.fulfilled,
        (state, action: PayloadAction<AuctionDetailsResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionDetails = action.payload.bidders;
          state.bidders = action.payload.bidders;
          state.product = action.payload.product;
          state.error = null;
        }
      )
      .addCase(getAuctionDetailsBySlugThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi lấy chi tiết đấu giá";
      });
  },
});

export default getAuctionDetailsBySlugSlice.reducer;
