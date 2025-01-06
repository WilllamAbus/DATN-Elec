import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTop3HighestBiddersThunk } from "../Thunk";
import { GetTop3HighestBidderResponse, Bidder } from "../../../../services/detailProductAuction/types/getTop3HighestBidders";

interface AuctionTopBiddersState {
  topBidders: Bidder[] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: AuctionTopBiddersState = {
  topBidders: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getTop3HighestBiddersSlice = createSlice({
  name: "auctionClient/getTop3HighestBidders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTop3HighestBiddersThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getTop3HighestBiddersThunk.fulfilled,
        (state, action: PayloadAction<GetTop3HighestBidderResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.topBidders = action.payload.topBidders;
          state.error = null;
        }
      )
      .addCase(getTop3HighestBiddersThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi lấy danh sách 3 người đấu giá cao nhất";
      });
  },
});

export default getTop3HighestBiddersSlice.reducer;
