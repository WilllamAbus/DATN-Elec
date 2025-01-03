import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuctionPricingRangeThunk } from "../Thunk";
import { AuctionPricingRangeResponse, AuctionPricing } from "../../../../services/detailProductAuction/types/getAuctionPricingRange";

interface AuctionPricingState {
  auctionPricing: AuctionPricing | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: AuctionPricingState = {
  auctionPricing: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getAuctionPricingRangeSlice = createSlice({
  name: "auctionClient/getAuctionPricingRange",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAuctionPricingRangeThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAuctionPricingRangeThunk.fulfilled,
        (state, action: PayloadAction<AuctionPricingRangeResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionPricing = action.payload.auctionPricing;
          state.error = null;
        }
      )
      .addCase(getAuctionPricingRangeThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi lấy thông tin phạm vi giá đấu giá";
      });
  },
});

export default getAuctionPricingRangeSlice.reducer;
