import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkAuctionTimeAuctionPricingRangeThunk } from "../Thunk";
import { CheckAuctionTimeAuctionPricingRangeResponse, AuctionPricing } from "../../../../services/detailProductAuction/types/checkAuctionTimeAuctionPricingRange";

interface AuctionCheckTimeState {
  auctionPricing: AuctionPricing | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: AuctionCheckTimeState = {
  auctionPricing: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const checkAuctionTimeAuctionPricingRangeSlice = createSlice({
  name: "auctionClient/checkAuctionTimeAuctionPricingRange",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuctionTimeAuctionPricingRangeThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        checkAuctionTimeAuctionPricingRangeThunk.fulfilled,
        (state, action: PayloadAction<CheckAuctionTimeAuctionPricingRangeResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionPricing = action.payload.auctionPricing || null;
          state.error = null;
        }
      )
      .addCase(checkAuctionTimeAuctionPricingRangeThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi kiểm tra thời gian đấu giá";
      });
  },
});

export default checkAuctionTimeAuctionPricingRangeSlice.reducer;
