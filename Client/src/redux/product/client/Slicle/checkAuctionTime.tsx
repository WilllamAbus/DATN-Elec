import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkAuctionTimeThunk } from "../Thunk";
import { CheckAuctionTimeResponse, Bidder } from "../../../../services/detailProductAuction/types/checkAuctionTime";

interface AuctionCheckTimeState {
  bidders: Bidder[] | null;
  auctionDetails: CheckAuctionTimeResponse['bidders'] | null;
  product: CheckAuctionTimeResponse['product'] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: AuctionCheckTimeState = {
  bidders: null,
  auctionDetails: null,
  product: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const checkAuctionTimeSlice = createSlice({
  name: "auctionClient/checkAuctionTime",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuctionTimeThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        checkAuctionTimeThunk.fulfilled,
        (state, action: PayloadAction<CheckAuctionTimeResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.auctionDetails = action.payload.bidders;
          state.bidders = action.payload.bidders;
          state.product = action.payload.product;
          state.error = null;
        }
      )
      .addCase(checkAuctionTimeThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi kiểm tra thời gian đấu giá";
      });
  },
});

export default checkAuctionTimeSlice.reducer;
