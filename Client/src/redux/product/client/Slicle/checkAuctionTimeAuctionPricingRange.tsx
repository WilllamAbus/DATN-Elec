import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkAuctionTimeAuctionPricingRangeThunk } from "../Thunk";
import { CheckAuctionTimeAuctionPricingRangeResponse } from "../../../../services/detailProductAuction/types/checkAuctionTimeAuctionPricingRange";

interface CheckAuctionTimeAuctionPricingRangeState {
  auctionTimeData: CheckAuctionTimeAuctionPricingRangeResponse | null;
  status: "idle" | "loading" | "success" | "fail";
  error: { code: string; msg: string } | null;
  isLoading: boolean;
}

const initialState: CheckAuctionTimeAuctionPricingRangeState = {
  auctionTimeData: null,
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
          state.auctionTimeData = action.payload;
          state.error = null;
        }
      )
      .addCase(checkAuctionTimeAuctionPricingRangeThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || { code: "LOI_KHONG_XAC_DINH", msg: "Lỗi không xác định" };
      });
  },
});

export default checkAuctionTimeAuctionPricingRangeSlice.reducer;
