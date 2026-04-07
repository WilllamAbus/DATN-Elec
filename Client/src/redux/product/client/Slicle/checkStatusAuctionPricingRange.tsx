import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkStatusAuctionPricingRangeThunk } from "../Thunk";
import { CheckStatusAuctionPricingRangeResponse, Bidder } from "../../../../services/detailProductAuction/types/checkStatusAuctionPricingRange";

interface CheckStatusAuctionPricingRangeState {
  bidders: Bidder[] | null;
  product: CheckStatusAuctionPricingRangeResponse['product'] | null;
  showModal: boolean;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: CheckStatusAuctionPricingRangeState = {
  bidders: null,
  product: null,
  showModal: false,
  status: "idle",
  error: null,
  isLoading: false,
};

const checkStatusAuctionPricingRangeSlice = createSlice({
  name: "auctionClient/checkStatusAuctionPricingRange",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkStatusAuctionPricingRangeThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        checkStatusAuctionPricingRangeThunk.fulfilled,
        (state, action: PayloadAction<CheckStatusAuctionPricingRangeResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.bidders = action.payload.bidders;
          state.product = action.payload.product;
          state.showModal = action.payload.showModal;
          state.error = null;
        }
      )
      .addCase(checkStatusAuctionPricingRangeThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi kiểm tra trạng thái đấu giá";
      });
  },
});

export default checkStatusAuctionPricingRangeSlice.reducer;
