import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBiddingListThunk } from "../Thunk";
import {
  BiddingListResponse,
  Pagination,
} from "../../../../services/detailProductAuction/types/getBiddingList";

interface BiddingListState {
  productDetails: BiddingListResponse["data"]["productDetails"] | null;
  biddingList: BiddingListResponse["data"]["biddingList"] | null;
  pagination: Pagination | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: BiddingListState = {
  productDetails: null,
  biddingList: null,
  pagination: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getBiddingListSlice = createSlice({
  name: "auctionClient/getBiddingList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBiddingListThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getBiddingListThunk.fulfilled,
        (state, action: PayloadAction<BiddingListResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.productDetails = action.payload.data.productDetails;
          state.biddingList = action.payload.data.biddingList;
          state.pagination = action.payload.data.pagination || null;
          state.error = null;
        }
      )
      .addCase(getBiddingListThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching bidding list";
      });
  },
});

export default getBiddingListSlice.reducer;
